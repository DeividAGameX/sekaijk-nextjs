import {getServerSession} from "next-auth";
import {authOptions as config} from "@/utils/AuthOptions";
import Unauthorized from "@/components/dashboard/Unauthorized";
import InfoSnapshot from "@/features/analytics/components/InfoSnapshot";
import AnalyticsModel from "@/features/analytics/lib/AnyalyticsModel";
import SiteVisit from "@/features/analytics/components/SiteVisit";
import DeviceStatus from "@/features/analytics/components/DevicesStats";
import CountryStats from "@/features/analytics/components/CountryStats";

interface Session {
    user: {
        name: string;
    };
}

async function DashboardPage() {
    const session = await getServerSession(config);
    if (!session) return <Unauthorized />;
    const userName = (session as Session).user.name;
    const analyticsData = await AnalyticsModel.findFirst({
        include: {
            AnalyticsCountry: true,
            AnalyticsDevice: true,
            AnalyticsTopPage: true,
            AnalyticsTopTitle: true,
            AnalyticsTrafficSource: true,
        },
        orderBy: {
            id: "desc",
        },
    });
    if (!analyticsData) return null;
    return (
        <div className="h-full overflow-auto">
            <InfoSnapshot
                name={userName}
                date={analyticsData.date}
                pageViews={analyticsData.pageViews}
                totalUsers={analyticsData.totalUsers}
                newUsers={analyticsData.newUsers}
                bounceRate={analyticsData.bounceRate}
                avgSessionDuration={analyticsData.avgSessionDuration}
            />
            <div className="flex flex-col-reverse gap-4 xl:flex-row">
                <SiteVisit
                    AnalyticsTopTitle={analyticsData.AnalyticsTopTitle}
                />
                <div className="flex-1 flex gap-4 flex-col md:flex-row md:ju xl:flex-col">
                    <DeviceStatus
                        AnalyticsDevice={analyticsData.AnalyticsDevice}
                    />
                    <CountryStats
                        AnalyticsCountry={analyticsData.AnalyticsCountry}
                    />
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
