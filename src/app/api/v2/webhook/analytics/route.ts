import createSnapshot from "@/features/analytics/service/createSnapshot.service";
import sendNotification from "@/features/notifications/utils/sendNotification";
import {NextRequest, NextResponse} from "next/server";

const AUTH_TOKEN = process.env.AUTH_TOKEN;

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || authHeader !== AUTH_TOKEN) {
        return NextResponse.json({message: "not-allow"}, {status: 401});
    }
    const body = await req.json();
    const response = await createSnapshot(body);
    sendNotification({
        title: "Nueva captura de datos",
        message: "Se ha realizado una nueva captura de datos",
        type: "SYSTEM",
        typeToSend: "ROL",
        id: 1,
    }).catch((err) => console.log(err));
    return NextResponse.json(response);
}
