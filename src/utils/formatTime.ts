export default function formatTime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const padded = (num: number) => String(num).padStart(2, "0");

    return hrs > 0
        ? `${padded(hrs)}:${padded(mins)}:${padded(secs)}`
        : `${padded(mins)}:${padded(secs)}`;
}
