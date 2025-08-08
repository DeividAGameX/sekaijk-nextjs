import formatTime from "@/utils/formatTime";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Button, Input, Modal} from "antd";
import {useTranslations} from "next-intl";
import {useState} from "react";

interface NoteItem {
    content: string;
    time: number;
}

interface NoteComponentsProps {
    value?: NoteItem[];
    currentTime: number;
    open: boolean;
    onChange?: (value: NoteItem[]) => void;
    onClose: () => void;
}

function NoteComponents({
    value,
    open,
    onChange,
    currentTime,
    onClose,
}: NoteComponentsProps) {
    const [note, setNote] = useState("");
    const tNote = useTranslations("youtube.formReview.note");

    const pushNote = () => {
        if (note.trim() === "") {
            return;
        }
        const newNote: NoteItem = {
            content: note,
            time: currentTime,
        };
        setNote("");
        onChange?.([...(value ?? []), newNote]);
        onClose();
    };

    const popNote = (index: number) => () => {
        onChange?.((value ?? []).filter((_, i) => i !== index));
    };

    return (
        <div className="flex-1 overflow-y-auto py-2 px-4">
            <Modal
                open={open}
                title={tNote("title").replace("$time", formatTime(currentTime))}
                onOk={pushNote}
                onCancel={onClose}
            >
                <label htmlFor="note" className="mb-4">
                    {tNote("label")}
                </label>
                <Input.TextArea
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="max-h-32"
                />
            </Modal>
            {(value ?? [])
                .sort((a, b) => a.time - b.time)
                .map((note, index) => (
                    <div
                        key={index}
                        className="flex items-center mb-2 bg-neutral-950 rounded-xl py-2 px-4"
                    >
                        <div className="flex-1">
                            <div className="font-medium">{note.content}</div>
                            <div className="text-gray-500">
                                {formatTime(note.time)}
                            </div>
                        </div>
                        <Button danger type="primary" onClick={popNote(index)}>
                            <FontAwesomeIcon icon={faTrash} />
                        </Button>
                    </div>
                ))}
        </div>
    );
}

export default NoteComponents;
