import {verifySignedToken} from "@/utils/signedToken";
import {NextRequest, NextResponse} from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const [name, key] = body.key.split(":");
    const isValid = verifySignedToken(
        "validate",
        name,
        key,
        process.env.SECRET ?? ""
    );
    if (!isValid) {
        return NextResponse.json({message: "invalid-token"}, {status: 401});
    }
    return NextResponse.json({key: "OK"}, {status: 200});
}
