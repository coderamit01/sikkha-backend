/*
  Warnings:

  - You are about to drop the `tutor_subjects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tutor_subjects" DROP CONSTRAINT "tutor_subjects_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "tutor_subjects" DROP CONSTRAINT "tutor_subjects_tutorId_fkey";

-- DropTable
DROP TABLE "tutor_subjects";

-- CreateTable
CREATE TABLE "_CategoryToTutor" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoryToTutor_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CategoryToTutor_B_index" ON "_CategoryToTutor"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToTutor" ADD CONSTRAINT "_CategoryToTutor_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToTutor" ADD CONSTRAINT "_CategoryToTutor_B_fkey" FOREIGN KEY ("B") REFERENCES "tutors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
