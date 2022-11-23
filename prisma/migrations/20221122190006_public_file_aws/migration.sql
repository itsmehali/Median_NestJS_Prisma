/*
  Warnings:

  - You are about to drop the column `image` on the `profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "profile" DROP COLUMN "image",
ADD COLUMN     "imageURL" TEXT;

-- CreateTable
CREATE TABLE "publicfile" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "profileID" INTEGER NOT NULL,

    CONSTRAINT "publicfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "publicfile_profileID_key" ON "publicfile"("profileID");

-- AddForeignKey
ALTER TABLE "publicfile" ADD CONSTRAINT "publicfile_profileID_fkey" FOREIGN KEY ("profileID") REFERENCES "profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
