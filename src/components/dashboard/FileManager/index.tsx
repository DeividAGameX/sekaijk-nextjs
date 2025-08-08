import React, {useMemo, useState} from "react";
import {
    Modal,
    Upload,
    Button,
    UploadProps,
    message,
    Tooltip,
    Spin,
    Progress,
} from "antd";
import {ResourceType} from "@prisma/client";
import {
    useDeleteFolderMutation,
    useDeleteResourceMutation,
    useGetResourcesQuery,
    useUploadFolderMutation,
    useUploadResourceMutation,
} from "@/features/users/lib/resources.reducer";
import axios from "axios";
import CustomVideoPlayer from "./CustomVideoPlayer";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faFolderPlus,
    faUpload,
} from "@fortawesome/free-solid-svg-icons";
import ImgCrop from "antd-img-crop";
import FolderCreateForm from "./FileManagerFolderForm";
import ImageResource from "./ImageResource";
import FolderView from "./FolderView";
import useUserSession from "@/hooks/useUserSession";

interface FileManagerProps {
    isOpen: boolean;
    onClose: () => void;
    selectResource?: (url: string) => void;
    imgAspect?: number;
    accept?: ResourceType[];
}

interface FolderProps {
    name: string;
    parentId: string | null;
}

const FileManager: React.FC<FileManagerProps> = ({
    isOpen,
    onClose,
    selectResource,
    imgAspect,
    accept,
}) => {
    const [modelFolder, setModelFolder] = useState(false);
    const {token} = useUserSession();
    const [isUpdating, setIsUpdating] = useState(false);
    const [statusProgress, setStatusProgress] = useState("");
    const [progressCount, setProgressCount] = useState(0);
    const [folderId, setFolderId] = useState<string>("");
    const [messageApi, context] = message.useMessage();
    const {data: userResources, isLoading} = useGetResourcesQuery(folderId);
    const [uploadResource, {isLoading: uploadingResource}] =
        useUploadResourceMutation();
    const [uploadFolder, {isError: errorFolder, isLoading: uploadingFolder}] =
        useUploadFolderMutation();
    const [deleteResource, {isLoading: deletingResource}] =
        useDeleteResourceMutation();
    const [deleteFolder, {isLoading: deletingFolder}] =
        useDeleteFolderMutation();

    const loading = useMemo(
        () =>
            isLoading ||
            uploadingResource ||
            deletingResource ||
            deletingFolder ||
            isUpdating ||
            uploadingFolder,
        [
            isLoading,
            uploadingResource,
            deletingResource,
            deletingFolder,
            isUpdating,
            uploadingFolder,
        ]
    );

    const handleUploadImg: UploadProps["customRequest"] = async (options) => {
        const {onSuccess, filename, file, onError} = options;
        const data = new FormData();
        setStatusProgress(`Subiendo: ${filename ?? ""}`);
        setIsUpdating(true);
        data.append("file", file);
        data.append("cloud_name", process.env.NEXT_PUBLIC_CLOUD_NAME ?? "");
        data.append(
            "upload_preset",
            process.env.NEXT_PUBLIC_UPLOAD_PRESET ?? ""
        );
        axios
            .post(
                `${process.env.NEXT_PUBLIC_API_CLOUDINARY}/auto/upload`,
                data,
                {
                    onUploadProgress: ({total, loaded}) => {
                        setProgressCount(
                            Math.round((loaded / (total || 1)) * 100)
                        );
                    },
                }
            )
            .then(async ({data}) => {
                try {
                    setIsUpdating(false);
                    setStatusProgress("Archivo subido, Guardando...");
                    await uploadResource({
                        name: data.asset_id ?? "",
                        resourceId: data.public_id ?? "",
                        url: data.secure_url ?? "",
                        type: data.resource_type.toUpperCase() ?? "",
                        usersFoldersId: userResources?.id ?? null,
                    });
                    if (onSuccess) onSuccess(data, new XMLHttpRequest());
                    messageApi.success("File uploaded successfully");
                } catch (error) {
                    console.log(error);
                    onError?.({
                        name: "Network Error",
                        message: "Failed to upload file",
                    });
                }
            })
            .catch((error) => {
                setIsUpdating(false);
                console.log("Error al subir archivo");
                console.log(error);
                onError?.({
                    name: "Network Error",
                    message: "Failed to upload file",
                });
            });
    };

    const handleUpload: UploadProps["customRequest"] = async (options) => {
        try {
            const {onSuccess, onError, filename, file} = options;
            const typeFile = (file as File).type;
            if (typeFile.split("/")[0] !== "video") {
                return handleUploadImg(options);
            }
            const data = new FormData();
            setStatusProgress(`Subiendo: ${filename ?? ""}`);
            setIsUpdating(true);
            data.append("file", file);
            setStatusProgress("Archivo subido, Guardando...");
            axios
                .post(`${process.env.NEXT_PUBLIC_CDN}/upload`, data, {
                    onUploadProgress: ({total, loaded}) => {
                        setProgressCount(
                            Math.round((loaded / (total || 1)) * 100)
                        );
                    },
                    headers: {
                        Authorization: `Key ${token}`,
                    },
                })
                .then(
                    async ({data}: {data: {key: string; message: string}}) => {
                        try {
                            setIsUpdating(false);
                            setStatusProgress("Archivo subido, Guardando...");
                            console.log(data);
                            await uploadResource({
                                name: filename ?? "",
                                resourceId: data.key ?? "",
                                url: `${process.env.NEXT_PUBLIC_CDN}/video/${data.key}`,
                                type:
                                    typeFile.split("/")[0].toUpperCase() ?? "",
                                usersFoldersId: userResources?.id ?? null,
                            });
                            if (onSuccess)
                                onSuccess(data, new XMLHttpRequest());
                            messageApi.success("File uploaded successfully");
                        } catch (error) {
                            console.log(error);
                            onError?.({
                                name: "Network Error",
                                message: "Failed to upload file",
                            });
                        }
                    }
                )
                .catch((error) => {
                    setIsUpdating(false);
                    console.log("Error al subir archivo");
                    console.log(error);
                    onError?.({
                        name: "Network Error",
                        message: "Failed to upload file",
                    });
                });
        } catch (error) {
            setIsUpdating(false);
            console.log("Error al subir archivo");
            console.log(error);
        }
    };

    const handleCreateFolder = async (data: FolderProps) => {
        await uploadFolder(data);
        if (errorFolder) {
            messageApi.error("Failed to create folder");
            return Promise.resolve(false);
        }
        messageApi.success("File uploaded successfully");
        setModelFolder(false);
        return Promise.resolve(true);
    };

    const handleDelete = async (resourceId: number) => {
        try {
            await deleteResource(resourceId);
            messageApi.success("File deleted successfully");
        } catch (error) {
            console.log(error);
            messageApi.error("Failed to delete file");
        }
    };

    const handleDeleteFolder = async (folderId: string) => {
        try {
            await deleteFolder(folderId);
            messageApi.success("File deleted successfully");
        } catch (error) {
            console.log(error);
            messageApi.error("Failed to delete file");
        }
    };

    const handleSelect = (url: string) => {
        if (selectResource) {
            selectResource(url);
        }
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-4">
                    {userResources?.id && (
                        <Tooltip title={"Volver"}>
                            <Button
                                type="text"
                                onClick={() => {
                                    if (userResources?.parentId) {
                                        setFolderId(
                                            `folder=${userResources?.parentId}`
                                        );
                                    } else {
                                        setFolderId("");
                                    }
                                }}
                            >
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </Button>
                        </Tooltip>
                    )}
                    <p>Archivos</p>
                    <Tooltip title={"Agregar una carpeta"}>
                        <Button
                            type="text"
                            onClick={() => setModelFolder(true)}
                        >
                            <FontAwesomeIcon icon={faFolderPlus} />
                        </Button>
                    </Tooltip>
                </div>
            }
            open={isOpen}
            onCancel={onClose}
            width={1200}
            footer={null}
            classNames={{
                body: "flex flex-col gap-4",
            }}
            closable={!isUpdating}
            maskClosable={!isUpdating}
        >
            {context}
            {imgAspect ? (
                <ImgCrop aspect={imgAspect}>
                    <Upload.Dragger
                        customRequest={handleUpload}
                        fileList={[]}
                        accept={"image/*"}
                        disabled={loading}
                    >
                        {isUpdating ? (
                            <div className="w-full">
                                <div className="w-full text-xl font-bold">
                                    <FontAwesomeIcon icon={faUpload} />
                                    <p>Subiendo archivo</p>
                                </div>
                                <div className="w-full">
                                    <p>{statusProgress}</p>
                                    {loading ? (
                                        <Progress percent={progressCount} />
                                    ) : (
                                        <Spin spinning={loading} />
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="w-full">
                                <div className="w-full text-xl font-bold">
                                    <FontAwesomeIcon icon={faUpload} />
                                    <p>Subir Archivos</p>
                                </div>
                                <div className="w-full">
                                    <p className="text-muted-foreground">
                                        Puede subir los siguientes archivos:{" "}
                                        {(accept ?? [])
                                            .map(getFileTitle)
                                            .join(",")}
                                        .
                                    </p>
                                </div>
                            </div>
                        )}
                    </Upload.Dragger>
                </ImgCrop>
            ) : (
                <Upload.Dragger
                    customRequest={handleUpload}
                    fileList={[]}
                    accept={(accept ?? [])
                        .map((t) => getAcceptedFileTypes(t))
                        .join(",")}
                    disabled={loading}
                >
                    {isUpdating ? (
                        <div className="w-full">
                            <div className="w-full text-xl font-bold">
                                <FontAwesomeIcon icon={faUpload} />
                                <p>Subiendo archivo</p>
                            </div>
                            <div className="w-full">
                                <p>{statusProgress}</p>
                                {loading ? (
                                    <Progress percent={progressCount} />
                                ) : (
                                    <Spin spinning={loading} />
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="w-full">
                            <div className="w-full text-xl font-bold">
                                <FontAwesomeIcon icon={faUpload} />
                                <p>Subir Archivos</p>
                            </div>
                            <div className="w-full">
                                <p className="text-muted-foreground">
                                    Puede subir los siguientes archivos:{" "}
                                    {(accept ?? []).map(getFileTitle).join(",")}
                                    .
                                </p>
                            </div>
                        </div>
                    )}
                </Upload.Dragger>
            )}

            <Spin
                wrapperClassName={`py-2 px-3 flex-1 max-h-[600px] ${
                    loading ? "overflow-hidden" : "overflow-auto"
                }`}
                rootClassName={`py-2 px-3 flex-1 max-h-[600px] ${
                    loading ? "overflow-hidden" : "overflow-auto"
                }`}
                spinning={loading}
            >
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                    {(userResources?.children ?? []).map((item, index) => (
                        <div
                            key={index}
                            className="overflow-hidden rounded-2xl flex h-56"
                        >
                            <FolderView
                                id={item.id}
                                name={item.name}
                                handleFolderClick={(folder) => {
                                    console.log(folder);
                                    setFolderId(`folder=${folder}`);
                                }}
                                handleDelete={handleDeleteFolder}
                            />
                        </div>
                    ))}
                    {(userResources?.Resources ?? []).map((item, index) => (
                        <div
                            key={index}
                            className="overflow-hidden rounded-2xl flex h-56"
                        >
                            {item.type == "IMAGE" && (
                                <ImageResource
                                    id={item.id}
                                    name={item.name}
                                    url={item.url}
                                    handleSelect={handleSelect}
                                    handleDelete={handleDelete}
                                />
                            )}
                            {(item.type == "VIDEO" || item.type == "AUDIO") && (
                                <CustomVideoPlayer
                                    src={item.url}
                                    onSelect={() => {
                                        handleSelect(item.url);
                                    }}
                                    onDelete={() => {
                                        handleDelete(item.id);
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </Spin>
            <FolderCreateForm
                isOpen={modelFolder}
                idFolder={userResources?.id ?? null}
                onSubmit={handleCreateFolder}
                onClose={() => setModelFolder(false)}
            />
        </Modal>
    );
};

const getAcceptedFileTypes = (type: ResourceType): string => {
    switch (type) {
        case ResourceType.VIDEO:
            return "video/*";
        case ResourceType.AUDIO:
            return "audio/*";
        case ResourceType.DOCUMENT:
            return ".pdf,.doc,.docx,.txt";
        case ResourceType.IMAGE:
            return "image/*";
        default:
            return "";
    }
};

const getFileTitle = (type: ResourceType): string => {
    switch (type) {
        case ResourceType.VIDEO:
            return "video";
        case ResourceType.AUDIO:
            return "audio";
        case ResourceType.DOCUMENT:
            return "documentos (.pdf,.doc,.docx,.txt)";
        case ResourceType.IMAGE:
            return "imágenes";
        default:
            return "";
    }
};

export default FileManager;
