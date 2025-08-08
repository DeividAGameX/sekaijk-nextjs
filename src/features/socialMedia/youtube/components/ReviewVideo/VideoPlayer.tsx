import formatTime from "@/utils/formatTime";
import {
    faExpand,
    faPause,
    faPlay,
    faVolumeHigh,
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Button, Slider, Tooltip} from "antd";
import React, {useEffect, useRef, useState} from "react";

interface VideoPlayerProps {
    src: string;
    onTimeUpdate?: (time: number) => void;
    openAddForm: boolean;
}

function VideoPlayer({src, openAddForm, onTimeUpdate}: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [show, setShow] = useState(false);
    const [progress, setProgress] = useState(0);

    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };

    const handleTimeUpdate = () => {
        const video = videoRef.current;
        if (video) {
            if (onTimeUpdate) onTimeUpdate(video.currentTime);
            setProgress((video.currentTime / video.duration) * 100);
        }
    };

    const handleProgressChange = (e: number) => {
        const video = videoRef.current;
        if (video) {
            const newTime = (e / 100) * video.duration;
            video.currentTime = newTime;
        }
    };

    const handleFullScreen = () => {
        const video = videoRef.current;
        if (video) {
            if (video.requestFullscreen) video.requestFullscreen();
        }
    };

    const handleVolumeChange = (volumen: number) => {
        const video = videoRef.current;
        if (video) {
            video.volume = volumen;
        }
    };

    useEffect(() => {
        if (openAddForm) {
            if (videoRef.current && !videoRef.current.paused) {
                videoRef.current.pause();
            }
        }
    }, [openAddForm]);

    return (
        <div
            className="w-full max-w-6xl mx-auto rounded-xl overflow-hidden shadow-lg bg-black relative"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            <video
                ref={videoRef}
                src={src}
                className="w-full h-full"
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />
            <div
                className={`w-full h-full absolute top-0 left-0 ${
                    show ? "opacity-100" : "opacity-0"
                } transition duration-150`}
            >
                <div className="w-ful h-full relative">
                    <div className="flex bg-neutral-950 py-1 px-2 items-center w-full gap-2 absolute bottom-0 left-0">
                        <Button
                            type="text"
                            icon={
                                <FontAwesomeIcon
                                    icon={isPlaying ? faPause : faPlay}
                                />
                            }
                            onClick={togglePlay}
                        />
                        <p>{formatTime(videoRef.current?.currentTime ?? 0)}</p>
                        <Slider
                            className="w-full"
                            value={progress}
                            min={0}
                            step={0.1}
                            max={100}
                            onChange={handleProgressChange}
                            tooltip={{
                                formatter: (v) => formatTime(v ?? 0),
                            }}
                        />
                        <p>{formatTime(videoRef.current?.duration ?? 0)}</p>
                        <Tooltip
                            title={
                                <Slider
                                    defaultValue={
                                        videoRef.current?.duration ?? 0
                                    }
                                    vertical
                                    min={0}
                                    step={0.01}
                                    max={1}
                                    onChange={handleVolumeChange}
                                    className="min-h-20"
                                    tooltip={{
                                        formatter: (v) =>
                                            Math.ceil((v ?? 0) * 100) + "%",
                                    }}
                                />
                            }
                        >
                            <Button
                                type="text"
                                icon={<FontAwesomeIcon icon={faVolumeHigh} />}
                            />
                        </Tooltip>
                        <Button
                            type="text"
                            icon={<FontAwesomeIcon icon={faExpand} />}
                            onClick={handleFullScreen}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VideoPlayer;
