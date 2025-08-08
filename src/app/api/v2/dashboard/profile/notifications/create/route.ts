import {NextRequest} from "next/server";
import {authOptions} from "@/utils/AuthOptions";
import validatePermission from "@/utils/ValidatePermissions";
import {getServerSession} from "next-auth";
import {NextResponse} from "next/server";
import sendNotification from "@/features/notifications/service/sendNotifications.service";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json({message: "not-allow"}, {status: 401});
    const id = (session?.user as {id: number}).id;
    const allowed = await validatePermission("@notifications-create", id);
    if (!allowed)
        return NextResponse.json({message: "not-allow"}, {status: 403});
    const body = await req.json();
    const response = await sendNotification(body);
    return NextResponse.json(...response);
}
