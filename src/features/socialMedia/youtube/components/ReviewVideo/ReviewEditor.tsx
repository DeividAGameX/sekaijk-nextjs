"use client";
import {Tag} from "@/features/tags/types/tag";
import {YoutubeVideoReviewType, YoutubeVideosType} from "../../types/youtube";
import {Button, Form, Input} from "antd";
import {useTranslations} from "next-intl";
import VideoPlayer from "./VideoPlayer";
import NoteComponents from "./Form/NotesComponent";
import {useState} from "react";

interface YoutubeVideo extends YoutubeVideosType {
    Tags: Tag[];
    Author: {
        name: string;
    };
}

interface ReviewEditorProps {
    video: YoutubeVideo;
    review: YoutubeVideoReviewType;
}

function ReviewEditor({video, review}: ReviewEditorProps) {
    const [form] = Form.useForm();
    const tForm = useTranslations("youtube.formReview");
    const [currentTime, setCurrentTime] = useState(0);
    const [open, setOpen] = useState(false);

    const openAddNote = () => {
        setOpen(true);
    };

    const aprroveReview = () => {};

    return (
        <div className="h-full w-full flex flex-col lg:flex-row">
            <div className="flex-1 flex justify-center items-center">
                <VideoPlayer
                    src={video.cloudinaryUrl ?? ""}
                    onTimeUpdate={setCurrentTime}
                    openAddForm={open}
                />
            </div>
            <div className="max-w-md w-full px-2 py-6">
                <Form
                    form={form}
                    initialValues={{
                        comment: review.comment,
                    }}
                    layout="vertical"
                >
                    <Form.Item name={"comment"} label={tForm("comment")}>
                        <Input.TextArea style={{resize: "none"}} />
                    </Form.Item>
                    <div className="my-2 w-full">
                        <Button block type="primary" onClick={openAddNote}>
                            {tForm("addNote")}
                        </Button>
                    </div>
                    <div className="my-2 w-full flex gap-4">
                        <Button block color="green" variant="solid">
                            {tForm("approve")}
                        </Button>
                        <Button block color="red" variant="solid">
                            {tForm("reject")}
                        </Button>
                    </div>
                    <Form.Item name={"notes"} noStyle>
                        <NoteComponents
                            open={open}
                            currentTime={currentTime}
                            onClose={() => setOpen(false)}
                        />
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default ReviewEditor;
