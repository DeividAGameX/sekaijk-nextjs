"use client";
import {useTranslations} from "next-intl";
// import useGetAnalytics from "../hooks/useGetAnalytics";
// import {AnalyticsSnapshot} from "../types/analyticsType";
import moment from "moment";
import Link from "next/link";
import {Button} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser, faUserPlus, faUsers} from "@fortawesome/free-solid-svg-icons";

interface InfoSnapshotProps {
    name: string;
    date: Date;
    pageViews: number;
    totalUsers: number;
    newUsers: number;
    bounceRate: number;
    avgSessionDuration: number;
}

function InfoSnapshot({
    name,
    date,
    pageViews,
    totalUsers,
    newUsers,
}: InfoSnapshotProps) {
    const tDashboard = useTranslations("dashboard");
    // const {data} = useGetAnalytics(initData);
    return (
        <div className="w-full rounded-xl py-4 md:px-6">
            <div className="w-full flex justify-between pb-4 flex-col gap-4 md:flex-row">
                <div className="flex-1">
                    <h1 className="text-2xl">
                        {tDashboard("hello")}
                        <b className="font-bold text-primary">{name}</b>
                    </h1>
                    <p>
                        {tDashboard("subTitle")}:{" "}
                        <b className="font-bold text-primary">
                            {moment(date).format("LL")}
                        </b>
                    </p>
                </div>
                <Link href={"/dashboard/posts"}>
                    <Button type="primary">{tDashboard("goPost")}</Button>
                </Link>
            </div>
            <div className="w-full grid md:grid-cols-3 gap-4">
                <div className="flex items-center justify-center gap-10 bg-neutral-950 py-4 px-2 rounded-xl">
                    <FontAwesomeIcon className="text-4xl" icon={faUserPlus} />
                    <div>
                        <h2 className="text-lg font-bold">
                            {tDashboard("infoSnapshot.newUsers")}
                        </h2>
                        <p className="text-2xl">{newUsers}</p>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-10 bg-neutral-950 py-4 px-2 rounded-xl">
                    <FontAwesomeIcon className="text-4xl" icon={faUser} />
                    <div>
                        <h2 className="text-lg font-bold">
                            {tDashboard("infoSnapshot.pageViews")}
                        </h2>
                        <p className="text-2xl">{pageViews}</p>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-10 bg-neutral-950 py-4 px-2 rounded-xl">
                    <FontAwesomeIcon className="text-4xl" icon={faUsers} />
                    <div>
                        <h2 className="text-lg font-bold">
                            {tDashboard("infoSnapshot.totalUsers")}
                        </h2>
                        <p className="text-2xl">{totalUsers}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InfoSnapshot;
