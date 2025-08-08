import FileManager from "@/components/dashboard/FileManager";
import {faImage} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Dropdown, Image} from "antd";
import {useState} from "react";

interface ThumbnailComponentProp {
    value?: string;
    onChange?: (value: string) => void;
}

function ThumbnailComponent({value, onChange}: ThumbnailComponentProp) {
    const [isOpen, setIsOpen] = useState(false);
    const [preview, setPreview] = useState(false);
    return (
        <div className="flex justify-center items-center mb-4">
            <div className="max-w-5xl w-full max-h-48 h-48 flex justify-center">
                {value ? (
                    <Dropdown
                        trigger={["click", "contextMenu"]}
                        menu={{
                            items: [
                                {
                                    key: 1,
                                    label: "Ver imagen",
                                    onClick: () => {
                                        setPreview(true);
                                    },
                                },
                                {
                                    key: 2,
                                    label: "Seleccionar imagen",
                                    onClick: () => {
                                        setIsOpen(true);
                                    },
                                },
                            ],
                        }}
                    >
                        <Image
                            src={value}
                            alt="name"
                            preview={{
                                visible: preview,
                                mask: null,
                                onVisibleChange: (v) => {
                                    if (!v) setPreview(v);
                                },
                            }}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                objectPosition: "center",
                            }}
                            wrapperStyle={{
                                width: "100%",
                                height: "100%",
                            }}
                        />
                    </Dropdown>
                ) : (
                    <div
                        className="w-full flex-1 border-dashed border-2 border-neutral-600 text-neutral-600 flex flex-col justify-center items-center rounded-xl cursor-pointer hover:border-primary hover:text-primary transition duration-150"
                        onClick={() => setIsOpen(true)}
                    >
                        <FontAwesomeIcon icon={faImage} />
                        <p className="text-center">Seleccionar la miniatura</p>
                    </div>
                )}
                <FileManager
                    accept={["IMAGE"]}
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

export default ThumbnailComponent;
