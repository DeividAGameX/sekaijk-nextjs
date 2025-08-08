import {useGetAnalyticsQuery} from "../lib/Analytics.reducer";
import {AnalyticsSnapshot} from "../types/analyticsType";

function useGetAnalytics(initialData: AnalyticsSnapshot, query?: {q: string}) {
    const result = useGetAnalyticsQuery(query ? query.q : "");
    return {
        ...result,
        data: result.data ?? initialData,
    };
}

export default useGetAnalytics;
