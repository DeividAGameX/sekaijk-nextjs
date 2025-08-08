/*
  Warnings:

  - You are about to drop the column `path` on the `AnalyticsTopPage` table. All the data in the column will be lost.
  - Added the required column `title` to the `AnalyticsTopPage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AnalyticsTopPage" DROP COLUMN "path",
ADD COLUMN     "title" TEXT NOT NULL;
