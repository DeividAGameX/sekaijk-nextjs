import {RespCommon} from "@/types/Resp";
import AnalyticsModel from "../lib/AnyalyticsModel";
import {validateErrorPrisma} from "@/utils/validateError";
import {AnalyticsSnapshot, Prisma} from "@prisma/client";
import {AnalyticsSnapshotCreate} from "../types/analyticsType";

export default async function createSnapshot(
    body: AnalyticsSnapshotCreate
): Promise<[AnalyticsSnapshot | RespCommon, ResponseInit]> {
    try {
        const {
            AnalyticsCountry,
            AnalyticsDevice,
            AnalyticsTopPage,
            AnalyticsTopTitle,
            AnalyticsTrafficSource,
            ...Snapshot
        } = body;
        const savedSnapshot = await AnalyticsModel.create({
            data: {
                AnalyticsCountry: {
                    create: AnalyticsCountry,
                },
                AnalyticsDevice: {
                    create: AnalyticsDevice,
                },
                AnalyticsTopPage: {
                    create: AnalyticsTopPage,
                },
                AnalyticsTopTitle: {
                    create: AnalyticsTopTitle,
                },
                AnalyticsTrafficSource: {
                    create: AnalyticsTrafficSource,
                },
                ...Snapshot,
                date: `${new Date().toISOString().split("T")[0]} 00:00:00.000Z`,
            },
            include: {
                AnalyticsTopPage: true,
                AnalyticsCountry: true,
                AnalyticsDevice: true,
                AnalyticsTrafficSource: true,
            },
        });
        return [savedSnapshot, {status: 200}];
    } catch (error) {
        console.log(error);
        return validateErrorPrisma(
            error as Prisma.PrismaClientKnownRequestError
        );
    }
}
