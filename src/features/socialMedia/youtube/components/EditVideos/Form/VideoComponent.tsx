import FileManager from "@/components/dashboard/FileManager";
import CustomVideoPlayer from "@/components/dashboard/FileManager/CustomVideoPlayer";
import {faVideo} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState} from "react";

interface VideoComponentProp {
    value?: string;
    onChange?: (value: string) => void;
}

function VideoComponent({value, onChange}: VideoComponentProp) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="h-full flex justify-center items-center">
            <div className="max-w-5xl w-full max-h-[560px] h-full flex justify-center">
                {value ? (
                    <CustomVideoPlayer
                        src={value}
                        onDelete={() => onChange?.("")}
                    />
                ) : (
                    <div
                        className="w-full flex-1 border-dashed border-2 border-neutral-600 text-neutral-600 flex flex-col justify-center items-center rounded-xl cursor-pointer hover:border-primary hover:text-primary transition duration-150"
                        onClick={() => setIsOpen(true)}
                    >
                        <FontAwesomeIcon icon={faVideo} />
                        <p className="text-center">Seleccionar video</p>
                    </div>
                )}
                <FileManager
                    accept={["VIDEO"]}
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    selectResource={(url) => {
                        onChange?.(url);
                        setIsOpen(false);
                    }}
                />
            </div>
        </div>
    );
}

export default VideoComponent;
