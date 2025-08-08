import {RespCommon} from "@/types/Resp";
import SendNotifications from "../utils/sendNotification";
import {SendNotificationProps} from "../types/notifications";

export default async function sendNotification(
    body: SendNotificationProps
): Promise<[RespCommon, ResponseInit]> {
    try {
        const result = await SendNotifications(body);
        if (!result) {
            return [{message: "fail"}, {status: 500}];
        }
        return [{message: "success"}, {status: 200}];
    } catch (error) {
        console.log(error);
        return [{message: "fail"}, {status: 500}];
    }
}
