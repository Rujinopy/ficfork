/*
  Warnings:

  - The `content` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "cover" DROP NOT NULL,
DROP COLUMN "content",
ADD COLUMN     "content" JSONB;
