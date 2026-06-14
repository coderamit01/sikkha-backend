/*
  Warnings:

  - Changed the type of `dayOfWeek` on the `availablity` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "availablity" DROP COLUMN "dayOfWeek",
ADD COLUMN     "dayOfWeek" "Week" NOT NULL;
