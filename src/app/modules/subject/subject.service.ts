import { AppError } from "../../helpers/appError";
import { IRequestUser } from "../../interface/requestUser.interface";
import { UserRole } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ISubjectPayload } from "./subject.interface";

const getAllSubject = async (user: IRequestUser) => {


  if (user.role === UserRole.ADMIN) {
    return await prisma.tutorSubject.findMany({
      include: {
        category: true,
        tutor: true
      },
    });
  }

  const tutor = await prisma.tutor.findUnique({
    where: { userId: user.userId }
  })

  if (!tutor) {
    throw new AppError("Tutor not found", 404);
  }

  if (user.role === UserRole.TUTOR) {
    return await prisma.tutorSubject.findMany({
      where: { tutorId: tutor.id },
      include: {
        category: true,
        tutor: true
      },
    });
  }
};


const createSubject = async (user: IRequestUser, payload: ISubjectPayload) => {

  const tutor = await prisma.tutor.findUnique({
    where: { userId: user.userId }
  });

  if (!tutor) {
    throw new AppError("Tutor not found", 404);
  }

  return await prisma.tutorSubject.create({
    data: {
      tutorId: tutor.id,
      categoryId: payload.categoryId,
    },
    include: {
      tutor: true,
      category: true
    }
  });
};

const updateSubject = async (user: IRequestUser, id: string, payload: ISubjectPayload) => {
  const tutor = await prisma.tutor.findUnique({
    where: { userId: user.userId }
  });
  if (!tutor) {
    throw new AppError("Tutor not found", 404);
  }

  return await prisma.tutorSubject.update({
    where: {
      id,
    },
    data: {
      categoryId: payload.categoryId
    },
    include: {
      category: true,
    },
  });
};

const deleteSubject = async (user: IRequestUser, id: string) => {
  if (user.role !== "TUTOR") { throw new AppError("Only tutors can delete subject", 403) }

  const tutor = await prisma.tutor.findUnique({
    where: { userId: user.userId }
  });

  if (!tutor) {
    throw new AppError("Tutor not found", 404);
  }

  const subject = await prisma.tutorSubject.findUnique({
    where: {
      id
    }
  })
  if (!subject) { throw new AppError("Subject not found", 404) }

  if (subject.tutorId !== tutor.id) {
    throw new AppError("You can only delete your own subjects", 403)
  }

  return await prisma.tutorSubject.delete({
    where: {
      id,
    },
  });
};

export const subjectService = {
  getAllSubject,
  createSubject,
  updateSubject,
  deleteSubject,
};
