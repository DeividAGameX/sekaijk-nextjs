/*
  Warnings:

  - Added the required column `notes` to the `YtVideosReview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "YtVideosReview" ADD COLUMN     "notes" JSONB NOT NULL;
