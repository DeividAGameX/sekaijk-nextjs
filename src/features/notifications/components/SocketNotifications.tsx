import {useEffect, useRef} from "react";
import io, {Socket} from "socket.io-client";
import {NotificationType as NotificationEnum} from "@prisma/client";
import {NotificationProp} from "../types/notifications";
import {notification} from "antd";

interface UserProvider {
    id: number;
    name: string;
    email: string;
    avatar: string;
    banner?: string | undefined | null;
    slug?: string | undefined | null;
    rolesId: number;
    createdAt: string;
    updatedAt: string;
    Roles: {
        id: number;
        name: string;
        description: string;
        Permissions: {permission: string}[];
    };
}

interface SocketNotificationsProps {
    user?: UserProvider | null;
    refetch: () => void;
    iconNotification: {[key in NotificationEnum]: string};
}

const MAX_RETRIES = 10;

function SocketNotifications({
    user,
    refetch,
    iconNotification,
}: SocketNotificationsProps) {
    const socketRef = useRef<Socket | null>(null);
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        if (!user) return;

        let attempt = 0;
        let isConnected = false;

        const connectWithRetry = () => {
            attempt++;

            const socket = io(
                `${process.env.NEXT_PUBLIC_SOCKET}/notifications`,
                {
                    reconnection: false,
                    transports: ["websocket"],
                }
            );

            socketRef.current = socket;

            socket.on("connect", () => {
                isConnected = true;
                console.log(`✅ Conectado al intento ${attempt}`);

                socket.on(
                    `newNotification-${user.id}`,
                    (newNotification: NotificationProp) => {
                        console.log("📩 Notificación recibida");
                        refetch();
                        api.open({
                            message: newNotification.title,
                            description: newNotification.message,
                            icon: (
                                <i
                                    className={
                                        iconNotification[newNotification.type]
                                    }
                                ></i>
                            ),
                        });
                    }
                );
            });

            socket.on("connect_error", (err) => {
                console.warn(`❌ Falló intento ${attempt}:`, err.message);
                socket.disconnect();

                if (!isConnected && attempt < MAX_RETRIES) {
                    setTimeout(connectWithRetry, 500 * attempt); // backoff progresivo
                } else if (!isConnected) {
                    console.error(
                        "🛑 No se pudo conectar después de varios intentos"
                    );
                }
            });
        };

        connectWithRetry();

        return () => {
            socketRef.current?.disconnect();
        };
    }, [user, refetch, api, iconNotification]);

    return contextHolder;
}

export default SocketNotifications;
