-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "rating" DECIMAL(3,2) DEFAULT 0;

-- AlterTable
ALTER TABLE "tutors" ALTER COLUMN "averageRating" DROP NOT NULL;
