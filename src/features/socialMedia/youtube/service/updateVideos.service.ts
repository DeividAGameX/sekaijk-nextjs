import {Prisma, YtVideos} from "@prisma/client";
import YoutubeModel from "../lib/YoutubeModel";
import {RespCommon} from "@/types/Resp";
import {validateErrorPrisma} from "@/utils/validateError";
import {YoutubeVideosUpdateForm} from "../types/youtube";

export default async function updateVideo(
    id: string,
    body: YoutubeVideosUpdateForm
): Promise<[YtVideos | RespCommon, ResponseInit]> {
    try {
        const {Tags, ...data} = body;
        const oldVideo = await YoutubeModel.findUnique({
            where: {
                id,
            },
            include: {
                Tags: true,
            },
        });
        if (!oldVideo) {
            return [{message: "Video not found"}, {status: 404}];
        }
        const oldTags = oldVideo.Tags.map((i) => ({id: i.id}));
        const video = await YoutubeModel.update({
            where: {
                id,
            },
            data: {
                ...data,
                Tags: {
                    disconnect: oldTags,
                    connect: (Tags ?? []).map((i) => ({
                        id: i,
                    })),
                },
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
