import {validateCreate} from "@/features/socialMedia/youtube/schemas/video.schema";
import CreateVideo from "@/features/socialMedia/youtube/service/createVideo.service";
import {authOptions} from "@/utils/AuthOptions";
import validatePermission from "@/utils/ValidatePermissions";
import {getServerSession} from "next-auth";
import {NextRequest, NextResponse} from "next/server";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json({message: "not-allow"}, {status: 401});
    const id = (session?.user as {id: number}).id;
    const allowed = await validatePermission("@ytVideo-create", id);
    if (!allowed)
        return NextResponse.json({message: "not-allow"}, {status: 403});
    const body = await req.json();
    const isValid = await validateCreate(body);
    if (isValid[1].status == 400) {
        return NextResponse.json(...isValid);
    }
    const response = await CreateVideo(body, id);
    return NextResponse.json(...response);
}
