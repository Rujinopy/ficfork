-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "whoFunded" TEXT[];

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "fundedPost" TEXT[];
