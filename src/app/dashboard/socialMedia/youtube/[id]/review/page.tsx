import Unauthorized from "@/components/dashboard/Unauthorized";
import ReviewEditor from "@/features/socialMedia/youtube/components/ReviewVideo/ReviewEditor";
import YoutubeModel from "@/features/socialMedia/youtube/lib/YoutubeModel";
import YoutubeReviewModel from "@/features/socialMedia/youtube/lib/YoutubeReviewModel";
import {authOptions} from "@/utils/AuthOptions";
import validatePermission from "@/utils/ValidatePermissions";
import {getServerSession} from "next-auth";

interface Props {
    params: Promise<{id: string}>;
}

async function ReviewPage({params}: Props) {
    const {id} = await params;
    const session = await getServerSession(authOptions);
    if (!session) return <Unauthorized />;
    const idUser = (session?.user as {id: number}).id;
    const result = await validatePermission("@ytVideo-review", idUser);
    if (!result) return <Unauthorized />;
    const review = await YoutubeReviewModel.findFirst({
        where: {
            ytVideosId: id,
            status: "PENDING",
            active: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    if (!review) return <div>No hay revision pendiente</div>;
    const video = await YoutubeModel.findFirst({
        where: {
            id: review.ytVideosId ?? "",
        },
        include: {
            Tags: true,
            Author: {
                select: {
                    name: true,
                },
            },
        },
    });
    if (!video) return <div>Video no encontrado</div>;
    return <ReviewEditor video={video} review={review} />;
}

export default ReviewPage;
