/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `tutors` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `tutors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `tutors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `tutors` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "tutors" ADD COLUMN     "contactNumber" TEXT,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "gender" "Gender" NOT NULL,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tutors_email_key" ON "tutors"("email");
