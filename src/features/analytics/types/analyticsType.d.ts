export interface AnalyticsSnapshotCreate {
    date: Date;
    pageViews: number;
    totalUsers: number;
    newUsers: number;
    bounceRate: number;
    avgSessionDuration: number;
    AnalyticsTopPage: AnalyticsTopPageCreate[];
    AnalyticsTopTitle: AnalyticsTopTitleCreate[];
    AnalyticsCountry: AnalyticsCountryCreate[];
    AnalyticsDevice: AnalyticsDeviceCreate[];
    AnalyticsTrafficSource: AnalyticsTrafficSourceCreate[];
}

export interface AnalyticsTopPageCreate {
    snapshotId: string;
    path: string;
    pageViews: number;
}

export interface AnalyticsTopTitleCreate {
    snapshotId: string;
    title: string;
    pageViews: number;
}

export interface AnalyticsTrafficSourceCreate {
    snapshotId: string;
    channel: string;
    sessions: number;
}

export interface AnalyticsCountryCreate {
    snapshotId: string;
    country: string;
    totalUsers: number;
}

export interface AnalyticsDeviceCreate {
    snapshotId: string;
    device: string;
    totalUsers: number;
}

export interface AnalyticsSnapshot {
    id: string;
    date: Date;
    pageViews: number;
    totalUsers: number;
    newUsers: number;
    bounceRate: number;
    avgSessionDuration: number;
    AnalyticsTopPage: AnalyticsTopPage[];
    AnalyticsTopTitle: AnalyticsTopTitle[];
    AnalyticsCountry: AnalyticsCountry[];
    AnalyticsDevice: AnalyticsDevice[];
    AnalyticsTrafficSource: AnalyticsTrafficSource[];
}

export interface AnalyticsTopPage {
    snapshotId: string;
    path: string;
    pageViews: number;
}

export interface AnalyticsTopTitle {
    snapshotId: string;
    title: string;
    pageViews: number;
}

export interface AnalyticsTrafficSource {
    snapshotId: string;
    channel: string;
    sessions: number;
}

export interface AnalyticsCountry {
    snapshotId: string;
    country: string;
    totalUsers: number;
}

export interface AnalyticsDevice {
    snapshotId: string;
    device: string;
    totalUsers: number;
}
