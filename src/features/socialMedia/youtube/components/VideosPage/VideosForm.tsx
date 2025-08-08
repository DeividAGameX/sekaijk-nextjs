"use client";
import {RootState} from "@/lib/store";
import {Form, Input, Modal} from "antd";
import {useTranslations} from "next-intl";
import {useRouter} from "next/navigation";
import {useDispatch, useSelector} from "react-redux";
import {toggleOpen} from "../../lib/VideoModal.reducer";
import {useCreateVideoMutation} from "../../lib/Video.reducer";
import {YoutubeVideosType} from "../../types/youtube";

function VideoCreate() {
    const {open} = useSelector((state: RootState) => state.youtubeModal);
    const navigate = useRouter();
    const [createVideo, {isLoading}] = useCreateVideoMutation();
    const tCategory = useTranslations("youtube.form");
    const tForm = useTranslations("components.form");
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const closeForm = () => {
        form.resetFields();
        dispatch(toggleOpen());
    };

    const finish = (data: YoutubeVideosType) => {
        form.resetFields();
        dispatch(toggleOpen());
        navigate.push(`/dashboard/socialMedia/youtube/${data.id}`);
    };

    const onSubmit = async () => {
        form.validateFields()
            .then((data) => {
                createVideo(data).then((event) => {
                    finish(event.data);
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <Modal
            open={open}
            onCancel={closeForm}
            title={tCategory("createTitle")}
            okText={tForm("create")}
            cancelText={tForm("cancel")}
            onOk={onSubmit}
            okButtonProps={{
                loading: isLoading,
            }}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name={"title"}
                    label={tCategory("title")}
                    rules={[
                        {
                            max: 150,
                            message: tForm("error.max150"),
                        },
                        {
                            required: true,
                            message: tForm("error.require"),
                        },
                    ]}
                >
                    <Input maxLength={150} />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default VideoCreate;
