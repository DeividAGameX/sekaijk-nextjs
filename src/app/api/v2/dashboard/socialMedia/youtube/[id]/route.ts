import {validateUpdate} from "@/features/socialMedia/youtube/schemas/video.schema";
import updateVideo from "@/features/socialMedia/youtube/service/updateVideos.service";
import {params} from "@/types/api/paramApi";
import {authOptions} from "@/utils/AuthOptions";
import validatePermission from "@/utils/ValidatePermissions";
import {getServerSession} from "next-auth";
import {NextRequest, NextResponse} from "next/server";

export async function PUT(req: NextRequest, {params}: params) {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json({message: "not-allow"}, {status: 401});
    const idUser = (session?.user as {id: number}).id;
    const allowed = await validatePermission("@ytVideo-update", idUser);
    if (!allowed)
        return NextResponse.json({message: "not-allow"}, {status: 403});
    const body = await req.json();
    const isInvalid = await validateUpdate(body);
    if (isInvalid[1].status == 400) {
        return NextResponse.json(...isInvalid);
    }
    const {id} = await params;
    const response = await updateVideo(id, body);
    return NextResponse.json(...response);
}
