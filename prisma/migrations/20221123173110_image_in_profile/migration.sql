/*
  Warnings:

  - You are about to drop the column `imageURL` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the `publicfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "publicfile" DROP CONSTRAINT "publicfile_profileID_fkey";

-- AlterTable
ALTER TABLE "profile" DROP COLUMN "imageURL",
ADD COLUMN     "image" TEXT;

-- DropTable
DROP TABLE "publicfile";
