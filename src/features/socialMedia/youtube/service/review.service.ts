import {validateErrorPrisma} from "@/utils/validateError";
import {YoutubeVideosUpdateForm} from "../types/youtube";
import {Prisma} from "@prisma/client";
import updateVideo from "./updateVideos.service";
import YoutubeReviewModel from "../lib/YoutubeReviewModel";
import {RespCommon} from "@/types/Resp";
import sendNotification from "@/features/notifications/utils/sendNotification";
import {NotificationType as NotificationEnum} from "@prisma/client";

export async function createReview(
    id: string,
    body: YoutubeVideosUpdateForm
): Promise<[RespCommon, ResponseInit]> {
    try {
        const [video, status] = await updateVideo(id, body);
        if ("message" in video) {
            return [video, status];
        }
        const lastReview = await YoutubeReviewModel.findFirst({
            where: {
                ytVideosId: video.id,
                active: true,
            },
        });
        if (lastReview) {
            return [{message: "review-was-create"}, {status: 200}];
        }
        await YoutubeReviewModel.create({
            data: {
                ytVideosId: video.id,
                active: true,
                status: "PENDING",
                authorId: video.usersId,
            },
        });
        sendNotification({
            title: "Solicitud de revisión para un video",
            message: `Se solicita una revisión para el video: ${video.title}.`,
            type: NotificationEnum.VIDEO_REVIEW,
            typeToSend: "PERMISSION",
            permission: "@ytVideo-review",
            targetUrl: `/dashboard/socialMedia/youtube/${id}/review`,
        });
        return [{message: "success"}, {status: 200}];
    } catch (error) {
        return validateErrorPrisma(
            error as Prisma.PrismaClientKnownRequestError
        );
    }
}
