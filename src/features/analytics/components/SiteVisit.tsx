"use client";
// import {useTranslations} from "next-intl";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import {AnalyticsTopTitle} from "../types/analyticsType";
import {Bar} from "react-chartjs-2";

interface SiteVisitProps {
    AnalyticsTopTitle: AnalyticsTopTitle[];
}

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function SiteVisit({AnalyticsTopTitle}: SiteVisitProps) {
    // const tDashboard = useTranslations("dashboard");
    console.log(AnalyticsTopTitle);
    return (
        <div className="py-2 px-6 bg-neutral-950 rounded-xl">
            <div className="overflow-auto">
                <div className="w-[1200px] h-[560px]">
                    <Bar
                        data={{
                            labels: AnalyticsTopTitle.map((item) => item.title),
                            datasets: [
                                {
                                    label: "Visitas",
                                    data: AnalyticsTopTitle.map(
                                        (item) => item.pageViews
                                    ),
                                    backgroundColor: "#d94862",
                                    borderWidth: 1,
                                },
                            ],
                        }}
                        options={{
                            plugins: {
                                title: {
                                    display: true,
                                    text: "SekAiJK - Paginas mas visitadas",
                                },
                            },
                            scales: {
                                x: {
                                    display: false,
                                },
                                xAxes: {
                                    ticks: {
                                        callback: function (value) {
                                            const label = this.getLabelForValue(
                                                Number(value)
                                            );
                                            return `${label.substr(0, 20)}...`;
                                        },
                                    },
                                },
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default SiteVisit;
