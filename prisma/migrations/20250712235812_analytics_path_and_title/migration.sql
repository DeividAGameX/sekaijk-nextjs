/*
  Warnings:

  - You are about to drop the column `title` on the `AnalyticsTopPage` table. All the data in the column will be lost.
  - Added the required column `path` to the `AnalyticsTopPage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AnalyticsTopPage" DROP COLUMN "title",
ADD COLUMN     "path" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "AnalyticsTopTitle" (
    "id" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "pageViews" INTEGER NOT NULL,

    CONSTRAINT "AnalyticsTopTitle_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AnalyticsTopTitle" ADD CONSTRAINT "AnalyticsTopTitle_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "AnalyticsSnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
