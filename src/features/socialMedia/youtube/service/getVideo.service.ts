import {RespCommon} from "@/types/Resp";
import {validateErrorPrisma} from "@/utils/validateError";
import {Prisma, YtVideos} from "@prisma/client";
import YoutubeModel from "../lib/YoutubeModel";

export default async function getVideos(): Promise<
    [YtVideos[] | RespCommon, ResponseInit]
> {
    try {
        const videos = await YoutubeModel.findMany();
        return [videos, {status: 200}];
    } catch (error) {
        console.error(error);
        return validateErrorPrisma(
            error as Prisma.PrismaClientKnownRequestError
        );
    }
}
