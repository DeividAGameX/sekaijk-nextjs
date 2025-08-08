-- CreateEnum
CREATE TYPE "YoutubeType" AS ENUM ('VIDEO', 'SHORTS');

-- CreateTable
CREATE TABLE "YtVideos" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail" TEXT,
    "videoId" TEXT,
    "cloudinaryId" TEXT,
    "cloudinaryUrl" TEXT,
    "ytUrl" TEXT,
    "type_video" "YoutubeType" NOT NULL DEFAULT 'VIDEO',
    "VideoStatus" "PostsStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "YtVideos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YtVideosReview" (
    "id" TEXT NOT NULL,
    "ytVideosId" TEXT,
    "comment" TEXT,
    "status" "REVIEW_STATUS" NOT NULL DEFAULT 'PENDING',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "authorId" INTEGER NOT NULL,
    "editorId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "YtVideosReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TagsToYtVideos" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TagsToYtVideos_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TagsToYtVideos_B_index" ON "_TagsToYtVideos"("B");

-- AddForeignKey
ALTER TABLE "YtVideosReview" ADD CONSTRAINT "YtVideosReview_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YtVideosReview" ADD CONSTRAINT "YtVideosReview_editorId_fkey" FOREIGN KEY ("editorId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YtVideosReview" ADD CONSTRAINT "YtVideosReview_ytVideosId_fkey" FOREIGN KEY ("ytVideosId") REFERENCES "YtVideos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagsToYtVideos" ADD CONSTRAINT "_TagsToYtVideos_A_fkey" FOREIGN KEY ("A") REFERENCES "Tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagsToYtVideos" ADD CONSTRAINT "_TagsToYtVideos_B_fkey" FOREIGN KEY ("B") REFERENCES "YtVideos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
