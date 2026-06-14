import { User } from "../../../generated/prisma/client";
import { AppError } from "../../helpers/appError";
import { IRequestUser } from "../../interface/requestUser.interface";
import { auth, UserRole } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { IRegisterPayload } from "./user.interface";


const creatTutor = async (payload: IRegisterPayload) => {
  const existUser = await prisma.user.findUnique({
    where: { email: payload.email }
  });

  if (existUser) {
    throw new AppError("User already exists", 400);
  }

  const userData = await auth.api.signUpEmail({
    body: {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: UserRole.TUTOR,
    }
  });

  try {
    const result = await prisma.$transaction(async (tx) => {
      const tutorData = await tx.tutor.create({
        data: {
          userId: userData.user.id,
          gender: payload.gender,
        }
      })
      return tutorData;
    })
    return result;
  } catch (error) {
    await prisma.user.delete({
      where: { id: userData.user.id }
    })
  }

}

const getAllUser = async (user: IRequestUser) => {
  if (user.role !== UserRole.ADMIN) {
    throw new AppError("Access Denied!", 403)
  }
  return await prisma.user.findMany({
    orderBy: { createdAt: "asc" }
  });
};

const updateUserStatus = async (user: IRequestUser, userId: string, userStatus: boolean) => {

  if (user.role !== UserRole.ADMIN) {
    throw new AppError("Access Denied!", 403)
  }

  return await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      isBanned: userStatus
    }
  });
};

const updateUser = async (user: IRequestUser, data: User, isAdmin: boolean) => {

  const exists = await prisma.user.findUniqueOrThrow({
    where: {
      id: user.userId
    }
  })

  if (!isAdmin && (exists.id !== user.userId)) {
    throw new AppError("Access Denied!", 403)
  }

  if (!isAdmin) {
    delete (data as any).isBanned;
  }

  return await prisma.user.update({
    where: {
      id: user.userId
    },
    data
  });
};


export const userService = {
  creatTutor,
  getAllUser,
  updateUserStatus,
  updateUser
}