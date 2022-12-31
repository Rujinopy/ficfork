/*
  Warnings:

  - You are about to drop the column `mangaTitleId` on the `Post` table. All the data in the column will be lost.
  - Added the required column `mangaTitle` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_mangaTitleId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "mangaTitleId",
ADD COLUMN     "mangaTitle" TEXT NOT NULL;
