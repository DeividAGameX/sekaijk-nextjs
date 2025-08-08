"use client";
import {Badge} from "antd";
import {AnalyticsDevice} from "../types/analyticsType";
import {useTranslations} from "next-intl";

interface DeviceStatusProps {
    AnalyticsDevice: AnalyticsDevice[];
}

function DeviceStatus({AnalyticsDevice}: DeviceStatusProps) {
    const tDevice = useTranslations("dashboard.devices");
    return (
        <div className="w-full bg-neutral-950 py-2 px-6 rounded-xl">
            <div className="text-center">
                <h1 className="text-2xl font-bold">{tDevice("title")}</h1>
            </div>
            <div className="py-2">
                {AnalyticsDevice.map((device) => (
                    <div
                        key={device.device}
                        className="flex justify-between items-center gap-2"
                    >
                        <h1 className="text-primary uppercase">
                            {tDevice.has(device.device)
                                ? tDevice(device.device)
                                : device.device}
                        </h1>
                        <Badge className="font-bold">{device.totalUsers}</Badge>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DeviceStatus;
