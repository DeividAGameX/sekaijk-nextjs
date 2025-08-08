"use client";
import {Badge} from "antd";
import {useTranslations} from "next-intl";
import {AnalyticsCountry} from "../types/analyticsType";

interface CountryStatsProps {
    AnalyticsCountry: AnalyticsCountry[];
}

function CountryStats({AnalyticsCountry}: CountryStatsProps) {
    const tDevice = useTranslations("dashboard.devices");
    return (
        <div className="w-full bg-neutral-950 py-2 px-6 rounded-xl">
            <div className="text-center">
                <h1 className="text-2xl font-bold">{tDevice("title")}</h1>
            </div>
            <div className="py-2">
                {AnalyticsCountry.map((item) => (
                    <div
                        key={item.country}
                        className="flex justify-between items-center gap-2"
                    >
                        <h1 className="text-primary uppercase">
                            {item.country}
                        </h1>
                        <Badge className="font-bold">{item.totalUsers}</Badge>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CountryStats;
