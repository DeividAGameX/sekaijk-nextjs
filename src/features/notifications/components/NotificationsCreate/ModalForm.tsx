import {Form, Input, Modal, Select, Switch} from "antd";
import {
    useGetToSendUsersQuery,
    useSendNotificationsMutation,
} from "../../lib/Notifications.reducer";
import {useState} from "react";
import {useTranslations} from "next-intl";
import {NotificationProp} from "../../types/notifications";

interface NotificationsModalFormProps {
    open: boolean;
    onClose: () => void;
}

interface NotificationsProps extends NotificationProp {
    users?: number[];
    typeToSend: "ALL" | "PERMISSION" | "USERS" | "ROL" | "POST";
}

const typeNotification = [
    "VIDEO",
    "INFO",
    "WARNING",
    "SUCCESS",
    "SYSTEM",
    "POST_REVIEW",
    "POST_REVIEW_ACCEPTED",
    "POST_REVIEW_CHANGED",
    "POST_PUBLISHED",
    "POST_ARCHIVED",
];

function NotificationsModalForm({open, onClose}: NotificationsModalFormProps) {
    const [allUsers, setAllUsers] = useState(false);
    const tCreated = useTranslations("notifications.form");
    const [form] = Form.useForm();
    const {data: users} = useGetToSendUsersQuery(null, {
        skip: false,
    });
    const [sendNotifications] = useSendNotificationsMutation();

    const handleSubmit = () => {
        form.validateFields().then((values: NotificationsProps) => {
            const sendData: NotificationsProps = {
                title: values.title,
                message: values.message,
                type: values.type,
                typeToSend: "ALL",
            };
            if (!allUsers) {
                sendData.users = values.users;
                sendData.typeToSend = "USERS";
            }
            sendNotifications(sendData);
            form.resetFields();
            onClose();
        });
    };

    return (
        <Modal
            title="Enviar notificación"
            open={open}
            onCancel={onClose}
            onClose={onClose}
            onOk={handleSubmit}
        >
            <Form form={form} layout="vertical">
                <div className="py-6">
                    <Switch
                        checked={allUsers}
                        onChange={(e) => setAllUsers(e)}
                        checkedChildren="Todos los usuarios"
                        unCheckedChildren="Elegir usuarios"
                    />
                </div>
                <Form.Item
                    name={"users"}
                    label={tCreated("users")}
                    required={!allUsers}
                >
                    <Select
                        mode="multiple"
                        allowClear
                        options={(users ?? []).map((u) => ({
                            label: u.name,
                            value: u.id,
                        }))}
                        disabled={allUsers}
                    />
                </Form.Item>
                <Form.Item
                    name={"type"}
                    label={tCreated("type")}
                    rules={[
                        {
                            required: true,
                            message: "Requerido",
                        },
                    ]}
                >
                    <Select
                        allowClear
                        options={typeNotification.map((t) => ({
                            label: tCreated(`notificationType.${t}`),
                            value: t,
                        }))}
                    />
                </Form.Item>
                <Form.Item
                    name={"title"}
                    label={tCreated("title")}
                    rules={[
                        {
                            required: true,
                            message: "Requerido",
                        },
                    ]}
                >
                    <Input maxLength={100} />
                </Form.Item>
                <Form.Item
                    name={"message"}
                    label={tCreated("message")}
                    rules={[
                        {
                            required: true,
                            message: "Requerido",
                        },
                    ]}
                >
                    <Input.TextArea maxLength={200} />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default NotificationsModalForm;
