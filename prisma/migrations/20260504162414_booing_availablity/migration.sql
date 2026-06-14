/*
  Warnings:

  - A unique constraint covering the columns `[availabilityId]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `availabilityId` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "availabilities" ADD COLUMN     "isBooked" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "availabilityId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "bookings_availabilityId_key" ON "bookings"("availabilityId");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_availabilityId_fkey" FOREIGN KEY ("availabilityId") REFERENCES "availabilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
