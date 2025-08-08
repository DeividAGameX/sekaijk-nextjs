import {Prisma, YtVideos} from "@prisma/client";
import YoutubeModel from "../lib/YoutubeModel";
import {RespCommon} from "@/types/Resp";
import {validateErrorPrisma} from "@/utils/validateError";
import {CreateVideo as CreateVideoType} from "../types/youtube";

export default async function CreateVideo(
    body: CreateVideoType,
    author: number
): Promise<[YtVideos | RespCommon, ResponseInit]> {
    try {
        const video = await YoutubeModel.create({
            data: {
                ...body,
                usersId: author,
            },
        });
        return [video, {status: 200}];
    } catch (error) {
        console.error(error);
        return validateErrorPrisma(
            error as Prisma.PrismaClientKnownRequestError
        );
    }
}
