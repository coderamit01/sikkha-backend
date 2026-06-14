/*
  Warnings:

  - You are about to drop the column `email` on the `tutors` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `tutors` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `tutors` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "tutors_email_key";

-- AlterTable
ALTER TABLE "tutors" DROP COLUMN "email",
DROP COLUMN "image",
DROP COLUMN "name";
