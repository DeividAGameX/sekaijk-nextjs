import {RespCommon} from "@/types/Resp";
import {AnalyticsSnapshot} from "../types/analyticsType";
import {validateErrorPrisma} from "@/utils/validateError";
import {Prisma} from "@prisma/client";
import AnalyticsModel from "../lib/AnyalyticsModel";

export default async function getAnalytics(
    date?: string
): Promise<[AnalyticsSnapshot | RespCommon, ResponseInit]> {
    try {
        let snapshot = null;
        if (date) {
            snapshot = await AnalyticsModel.findFirst({
                where: {
                    createdAt: date,
                },
                include: {
                    AnalyticsCountry: true,
                    AnalyticsDevice: true,
                    AnalyticsTopPage: true,
                    AnalyticsTrafficSource: true,
                    AnalyticsTopTitle: true,
                },
                orderBy: {
                    id: "desc",
                },
            });
        }
        snapshot = await AnalyticsModel.findFirst({
            include: {
                AnalyticsCountry: true,
                AnalyticsDevice: true,
                AnalyticsTopPage: true,
                AnalyticsTrafficSource: true,
                AnalyticsTopTitle: true,
            },
            orderBy: {
                id: "desc",
            },
        });
        if (!snapshot) {
            return [{message: "notFound"}, {status: 404}];
        }
        return [snapshot, {status: 200}];
    } catch (error) {
        console.log(error);
        return validateErrorPrisma(
            error as Prisma.PrismaClientKnownRequestError
        );
    }
}
