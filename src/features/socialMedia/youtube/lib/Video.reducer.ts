import AxiosBaseQuery from "@/lib/store/AxiosQuery";
import {createApi} from "@reduxjs/toolkit/query/react";
import {CreateVideo} from "../types/youtube";

export const youtubeApi = createApi({
    reducerPath: "youtubeVideos",
    baseQuery: AxiosBaseQuery,
    tagTypes: ["videos", "video", "reviewsVideos"],
    endpoints: (builder) => ({
        getAllVideos: builder.query({
            query: () => ({
                url: "/socialMedia/youtube",
                method: "GET",
            }),
        }),
        createVideo: builder.mutation({
            query: (data: CreateVideo) => ({
                url: "/socialMedia/youtube",
                method: "POST",
                data,
            }),
        }),
        updateVideo: builder.mutation({
            query: ({id, ...data}) => ({
                url: `/socialMedia/youtube/${id}`,
                method: "PUT",
                data,
            }),
        }),
        reviewVideo: builder.mutation({
            query: ({id, ...data}) => ({
                url: `/socialMedia/youtube/${id}/review`,
                method: "POST",
                data,
            }),
        }),
    }),
});

export const {
    useGetAllVideosQuery,
    useCreateVideoMutation,
    useUpdateVideoMutation,
    useReviewVideoMutation,
} = youtubeApi;
