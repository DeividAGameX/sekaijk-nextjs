import getAnalytics from "@/features/analytics/service/getAnalytics.service";
import {NextResponse} from "next/server";

export async function GET() {
    const response = await getAnalytics();
    return NextResponse.json(...response);
}
