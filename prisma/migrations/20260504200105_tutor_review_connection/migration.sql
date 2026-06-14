/*
  Warnings:

  - You are about to drop the column `rating` on the `reviews` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "rating";

-- AlterTable
ALTER TABLE "tutors" ADD COLUMN     "averageRating" DECIMAL(3,2) NOT NULL DEFAULT 0;
