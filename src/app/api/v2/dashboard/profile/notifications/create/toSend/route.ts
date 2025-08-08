import getUsersToSend from "@/features/notifications/service/getUsersToSend.service";
import {authOptions} from "@/utils/AuthOptions";
import validatePermission from "@/utils/ValidatePermissions";
import {getServerSession} from "next-auth";
import {NextResponse} from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json({message: "not-allow"}, {status: 401});
    const id = (session?.user as {id: number}).id;
    const allowed = await validatePermission("@notifications-create", id);
    if (!allowed)
        return NextResponse.json({message: "not-allow"}, {status: 403});
    const response = await getUsersToSend();
    return NextResponse.json(...response);
}
