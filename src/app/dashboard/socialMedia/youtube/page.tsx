import Unauthorized from "@/components/dashboard/Unauthorized";
import VideoCreate from "@/features/socialMedia/youtube/components/VideosPage/VideosForm";
import YoutubeHeader from "@/features/socialMedia/youtube/components/VideosPage/VideosHeader";
import {authOptions} from "@/utils/AuthOptions";
import validatePermission from "@/utils/ValidatePermissions";
import {getServerSession} from "next-auth";

async function YoutubePage() {
    const session = await getServerSession(authOptions);
    if (!session) return <Unauthorized />;
    const id = (session?.user as {id: number}).id;
    const result = await validatePermission("@ytVideos", id);
    if (!result) return <Unauthorized />;
    const viewAll = await validatePermission("@ytVideos-all", id);
    const canAdd = await validatePermission("@ytVideo-create", id);
    // const canEdit = await validatePermission("@ytVideo-update", id);
    // const canReview = await validatePermission("@ytVideo-publish", id);
    // const canDelete = await validatePermission("@ytVideo-delete", id);
    return (
        <div className="flex flex-col w-full h-full">
            <YoutubeHeader viewAll={viewAll} canAdd={canAdd} />
            {canAdd && <VideoCreate />}
        </div>
    );
}

export default YoutubePage;
