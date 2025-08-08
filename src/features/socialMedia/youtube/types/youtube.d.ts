import {YtVideos, YtVideosReview} from "@prisma/client";

export type YoutubeVideosType = YtVideos;

export type YoutubeVideoReviewType = YtVideosReview;

export interface CreateVideo {
    title: string;
}

export interface YoutubeVideosUpdateForm extends YoutubeVideosType {
    Tags: number[];
}
