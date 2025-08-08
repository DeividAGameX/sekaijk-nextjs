import Unauthorized from "@/components/dashboard/Unauthorized";
import EditorComponent from "@/features/socialMedia/youtube/components/EditVideos/EditorComponent";
import YoutubeModel from "@/features/socialMedia/youtube/lib/YoutubeModel";
import {authOptions} from "@/utils/AuthOptions";
import validatePermission from "@/utils/ValidatePermissions";
import {getServerSession} from "next-auth";
import {notFound} from "next/navigation";

interface Props {
    params: Promise<{id: string}>;
}

async function YoutubeEditVideo({params}: Props) {
    const {id} = await params;
    const session = await getServerSession(authOptions);
    if (!session) return <Unauthorized />;
    const idUser = (session?.user as {id: number}).id;
    const result = await validatePermission("@ytVideo-update", idUser);
    if (!result) return <Unauthorized />;
    const item = await YoutubeModel.findUnique({
        where: {
            id: id,
        },
        include: {
            Tags: true,
        },
    });
    if (!item) return notFound();
    console.log(item);
    return <EditorComponent {...item} />;
}

export default YoutubeEditVideo;
