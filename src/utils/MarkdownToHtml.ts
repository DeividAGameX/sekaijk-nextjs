import MarkdownIt from "markdown-it";

const md = new MarkdownIt();

// Embeded youtube
function toEmbedUrl(raw: string) {
  let url = raw.trim();

  // añade protocolo si viene sin él
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

  const u = new URL(url);
  let id = '';
  let start = 0;

  if (u.hostname === 'youtu.be') {
    id = u.pathname.slice(1);             // youtu.be/VIDEO_ID
    start = parseStart(u.searchParams.get('t') || u.searchParams.get('start') || "");
  } else if (u.hostname.includes('youtube.com')) {
    if (u.pathname === '/watch') {
      id = u.searchParams.get('v') ?? "";       // youtube.com/watch?v=VIDEO_ID
      start = parseStart(u.searchParams.get('t') || u.searchParams.get('start') || "");
    } else if (u.pathname.startsWith('/shorts/')) {
      id = u.pathname.split('/')[2];      // youtube.com/shorts/VIDEO_ID
    } else if (u.pathname.startsWith('/embed/')) {
      id = u.pathname.split('/')[2];      // ya viene en embed
      start = parseStart(u.searchParams.get('start') || "");
    }
  }

  if (!id) return null;

  const qs = new URLSearchParams({
    ...(start ? { start: String(start) } : {}),
    rel: '0',
    modestbranding: '1',
  });

  // Puedes usar youtube-nocookie para más privacidad
  return `https://www.youtube-nocookie.com/embed/${id}?${qs.toString()}`;
}

function parseStart(t: string) {
  if (!t) return 0;
  // acepta "90", "1m30s", "2h3m4s"
  const m = /(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(t);
  if (m && (m[1] || m[2] || m[3])) {
    const h = parseInt(m[1] || '0', 10);
    const min = parseInt(m[2] || '0', 10);
    const s = parseInt(m[3] || '0', 10);
    return h * 3600 + min * 60 + s;
  }
  const n = parseInt(t, 10);
  return Number.isFinite(n) ? n : 0;
}
// ---

function filterSpecial(markdown: string): string {
    let filtered = markdown.replace(
        /@\[tweet\]\((.*?)\)/g,
        (_, url) => `@TWEET(${url})`
    );
    filtered = filtered.replace(
        /@\[youtube\]\((.*?)\)/g,
        (_, url) => `@YOUTUBE(${url})`
    );
    return filtered;
}

function executeSpecial(html: string): string {
    let filtered = html.replace(
        /<p>@TWEET\((.*?)\)<\/p>/g,
        (_, url) =>
            `<a url="${url}" data-twitter-url="${url}" class="w-full flex justify-center tweet-embed"></a>`
    );
    filtered = filtered.replace(
        /@YOUTUBE\((.*?)\)/g,
        (_, url) =>
            `<div data-youtube-video=\"\"><iframe width=\"640\" height=\"480\" allowfullscreen=\"true\" autoplay=\"false\" disablekbcontrols=\"false\" enableiframeapi=\"false\" endtime=\"0\" ivloadpolicy=\"0\" loop=\"false\" modestbranding=\"false\" origin=\"\" playlist=\"\" rel=\"1\" src=\"${toEmbedUrl(url)}\" start=\"0\"></iframe></div>`
    );
    return filtered;
}

export function compileMarkdownToHtml(markdown: string): string {
    const html = md.render(filterSpecial(markdown));
    return executeSpecial(html);
}
