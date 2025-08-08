"use client";
import {Button, Form, Input, message, Select} from "antd";
import {useTranslations} from "next-intl";
import {YoutubeVideosType} from "../../types/youtube";
import VideoComponent from "./Form/VideoComponent";
import ThumbnailComponent from "./Form/ThumbnailComponent";
import {useGetAllTagsQuery} from "@/features/tags/lib/Tags.reducer";
import {Tag} from "@/features/tags/types/tag";
import TagRender from "@/features/posts/components/PostEditor/TagRender";
import {
    useReviewVideoMutation,
    useUpdateVideoMutation,
} from "../../lib/Video.reducer";

interface EditorComponentForm extends YoutubeVideosType {
    Tags: number[];
}

interface YoutubeVideosProps extends YoutubeVideosType {
    Tags: Tag[];
}

function EditorComponent({Tags, ...data}: YoutubeVideosProps) {
    const [form] = Form.useForm();
    const [messageApi, contextMessage] = message.useMessage();
    const tForm = useTranslations("youtube.form");
    const {data: tags} = useGetAllTagsQuery(null);
    const [updateVideo, {isLoading, error}] = useUpdateVideoMutation();
    const [reviewVideo, {isLoading: reviewing, error: reviewError}] =
        useReviewVideoMutation();

    const handleSave = () => {
        form.validateFields().then(async (e: EditorComponentForm) => {
            if (e.cloudinaryUrl) {
                e.cloudinaryId = e.cloudinaryUrl
                    .replace(
                        /https:\/\/res.cloudinary.com\/sekai-jk\/video\/upload\/v(\d)+\//g,
                        ""
                    )
                    .split(".")[0];
            }
            e.id = data.id;
            await updateVideo(e);
            if (!error) {
                return messageApi.success("Actualizado correctamente");
            }
            console.log(error);
        });
    };

    const handleReview = () => {
        form.validateFields().then(async (e: EditorComponentForm) => {
            if (e.cloudinaryUrl) {
                e.cloudinaryId = e.cloudinaryUrl
                    .replace(
                        /https:\/\/res.cloudinary.com\/sekai-jk\/video\/upload\/v(\d)+\//g,
                        ""
                    )
                    .split(".")[0];
                e.cloudinaryId = e.cloudinaryUrl.replace(
                    `${process.env.NEXT_PUBLIC_CDN}/video/`,
                    ""
                );
            }
            e.id = data.id;
            await reviewVideo(e);
            if (!reviewError) {
                return messageApi.success("Actualizado correctamente");
            }
            console.log(reviewError);
        });
    };

    return (
        <Form
            form={form}
            className="h-full overflow-auto flex gap-6"
            layout="vertical"
            initialValues={{
                ...data,
                Tags: (Tags ?? []).map((tag) =>
                    typeof tag === "object" ? tag.id : tag
                ),
            }}
        >
            {contextMessage}
            <div className="max-w-5xl w-full">
                <Form.Item name={"cloudinaryUrl"} noStyle>
                    <VideoComponent />
                </Form.Item>
            </div>
            <div className="flex-1 py-2 px-6">
                <Form.Item
                    name="title"
                    label={tForm("title")}
                    rules={[
                        {
                            required: true,
                            message: tForm(`errors.titleRequired`),
                        },
                    ]}
                >
                    <Input type="text" />
                </Form.Item>
                <Form.Item name="Tags" label={tForm("tags")}>
                    <Select
                        mode="multiple"
                        allowClear
                        options={(tags ?? []).map((e: Tag) => ({
                            value: e.id,
                            label: `${e.name}:${e.color}`,
                            color: e.color,
                        }))}
                        tagRender={TagRender}
                        optionRender={(e) => e.label?.toString().split(":")[0]}
                    />
                </Form.Item>
                <Form.Item name="description" label={tForm("description")}>
                    <Input.TextArea />
                </Form.Item>
                <Form.Item name={"thumbnail"} noStyle>
                    <ThumbnailComponent />
                </Form.Item>
                <div className="my-2 flex items-center gap-2">
                    <Button type="default" danger loading={isLoading}>
                        {tForm("cancel")}
                    </Button>
                    <Button
                        type="default"
                        onClick={handleSave}
                        loading={isLoading || reviewing}
                    >
                        {tForm("saveDraft")}
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleReview}
                        loading={isLoading || reviewing}
                    >
                        {tForm("review")}
                    </Button>
                </div>
            </div>
        </Form>
    );
}

export default EditorComponent;
