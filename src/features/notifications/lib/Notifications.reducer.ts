import AxiosBaseQuery from "@/lib/store/AxiosQuery";
import {createApi} from "@reduxjs/toolkit/query/react";
import {
    NotificationUserType,
    SendNotificationProps,
} from "../types/notifications";

interface NotificationRead {
    id: string;
    read: boolean;
}

interface SendToUser {
    id: number;
    name: string;
}

export const notificationsApi = createApi({
    reducerPath: "notifications",
    baseQuery: AxiosBaseQuery,
    tagTypes: ["notifications", "userSend"],
    endpoints: (builder) => ({
        getNotifications: builder.query<NotificationUserType[], null>({
            query: () => ({
                url: "/profile/notifications",
                method: "GET",
            }),
            providesTags: ["notifications"],
        }),
        getToSendUsers: builder.query<SendToUser[], null>({
            query: () => ({
                url: "/profile/notifications/create/toSend",
                method: "GET",
            }),
            providesTags: ["userSend"],
        }),
        markRead: builder.mutation({
            query: (data: NotificationRead) => ({
                url: "/profile/notifications",
                method: "POST",
                data: data,
            }),
            invalidatesTags: ["notifications"],
        }),
        markAllRead: builder.mutation({
            query: () => ({
                url: "/profile/notifications/mark-all",
                method: "POST",
            }),
            invalidatesTags: ["notifications"],
        }),
        sendNotifications: builder.mutation({
            query: (data: SendNotificationProps) => ({
                url: "/profile/notifications/create",
                method: "POST",
                data,
            }),
            invalidatesTags: ["notifications"],
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useMarkAllReadMutation,
    useMarkReadMutation,
    useGetToSendUsersQuery,
    useSendNotificationsMutation,
} = notificationsApi;
