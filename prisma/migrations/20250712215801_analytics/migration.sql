/*
  Warnings:

  - You are about to drop the `YtVideos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "YtVideos";

-- CreateTable
CREATE TABLE "AnalyticsSnapshot" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "pageViews" INTEGER NOT NULL,
    "totalUsers" INTEGER NOT NULL,
    "newUsers" INTEGER NOT NULL,
    "bounceRate" DOUBLE PRECISION NOT NULL,
    "avgSessionDuration" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsTopPage" (
    "id" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "pageViews" INTEGER NOT NULL,

    CONSTRAINT "AnalyticsTopPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsTrafficSource" (
    "id" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "sessions" INTEGER NOT NULL,

    CONSTRAINT "AnalyticsTrafficSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsCountry" (
    "id" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "totalUsers" INTEGER NOT NULL,

    CONSTRAINT "AnalyticsCountry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsDevice" (
    "id" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "device" TEXT NOT NULL,
    "totalUsers" INTEGER NOT NULL,

    CONSTRAINT "AnalyticsDevice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AnalyticsTopPage" ADD CONSTRAINT "AnalyticsTopPage_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "AnalyticsSnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsTrafficSource" ADD CONSTRAINT "AnalyticsTrafficSource_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "AnalyticsSnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsCountry" ADD CONSTRAINT "AnalyticsCountry_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "AnalyticsSnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsDevice" ADD CONSTRAINT "AnalyticsDevice_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "AnalyticsSnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
