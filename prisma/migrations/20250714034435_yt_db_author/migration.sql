/*
  Warnings:

  - Added the required column `usersId` to the `YtVideos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "YtVideos" ADD COLUMN     "usersId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "_UsersToYtVideos" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UsersToYtVideos_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UsersToYtVideos_B_index" ON "_UsersToYtVideos"("B");

-- AddForeignKey
ALTER TABLE "YtVideos" ADD CONSTRAINT "YtVideos_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsersToYtVideos" ADD CONSTRAINT "_UsersToYtVideos_A_fkey" FOREIGN KEY ("A") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsersToYtVideos" ADD CONSTRAINT "_UsersToYtVideos_B_fkey" FOREIGN KEY ("B") REFERENCES "YtVideos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
