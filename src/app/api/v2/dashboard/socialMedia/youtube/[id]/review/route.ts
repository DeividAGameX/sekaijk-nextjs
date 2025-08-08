// export async function POST() {}

import {validateReview} from "@/features/socialMedia/youtube/schemas/video.schema";
import {createReview} from "@/features/socialMedia/youtube/service/review.service";
import {params} from "@/types/api/paramApi";
import {authOptions} from "@/utils/AuthOptions";
import validatePermission from "@/utils/ValidatePermissions";
import {getServerSession} from "next-auth";
import {NextRequest, NextResponse} from "next/server";

export async function POST(req: NextRequest, {params}: params) {
    const {id: idPost} = await params;
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json({message: "not-allow"}, {status: 401});
    const id = (session?.user as {id: number}).id;
    const allowed = await validatePermission("@ytVideo-review", id);
    if (!allowed)
        return NextResponse.json({message: "not-allow"}, {status: 403});
    const body = await req.json();
    const isValid = validateReview(body);
    if (isValid[1].status == 400) {
        return NextResponse.json(...isValid);
    }
    const response = await createReview(idPost, body);
    return NextResponse.json(...response);
}
