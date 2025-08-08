import AxiosBaseQuery from "@/lib/store/AxiosQuery";
import {createApi} from "@reduxjs/toolkit/query/react";
import {AnalyticsSnapshot} from "../types/analyticsType";

export const analyticsApi = createApi({
    reducerPath: "analytics",
    baseQuery: AxiosBaseQuery,
    endpoints: (builder) => ({
        getAnalytics: builder.query<AnalyticsSnapshot, string>({
            query: (q: string) => ({
                url: `/analytics?${q}`,
                method: "GET",
            }),
        }),
    }),
});

export const {useGetAnalyticsQuery} = analyticsApi;
