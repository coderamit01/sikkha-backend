import { AppError } from "../../helpers/appError";
import { IRequestUser } from "../../interface/requestUser.interface";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { tokenUtils } from "../../utils/token";
import { ILoginPayload, IRegisterPayload } from "../user/user.interface";


const createUser = async (payload: IRegisterPayload) => {
  const existUser = await prisma.user.findUnique({
    where: { email: payload.email }
  });

  if (existUser) {
    throw new AppError("User already exists", 400);
  }

  const data = await auth.api.signUpEmail({
    body: payload
  });

  if (!data.user) {
    throw new AppError("Failed to create user", 500);
  }

  // const accessToken = tokenUtils.getAccessToken({
  //   userId: data.user.id,
  //   role: data.user.role,
  //   name: data.user.name,
  //   email: data.user.email,
  //   isBanned: data.user.isBanned
  // });

  // const refreshToken = tokenUtils.getRefreshToken({
  //   userId: data.user.id,
  //   role: data.user.role,
  //   name: data.user.name,
  //   email: data.user.email,
  //   isBanned: data.user.isBanned
  // });

  return {
    data
  };
}
const loginUser = async (payload: ILoginPayload) => {
  const { email, password } = payload;
  const data = await auth.api.signInEmail({
    body: {
      email,
      password
    },
    headers: new Headers()
  })

  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    isBanned: data.user.isBanned
  })
  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    isBanned: data.user.isBanned
  })
  return {
    ...data,
    accessToken,
    refreshToken
  };
}

const getMe = async (userData: IRequestUser) => {
  if (!userData?.userId) {
    throw new AppError("User data is missing or invalid", 401);
  }
  const existUser = await prisma.user.findUnique({
    where: {
      id: userData.userId
    },
    include: {
      tutor: {
        include: {
          availability: true,
          bookings: true,
          reviews: true,
          subjects: true,
        }
      },
      bookingsAsStudent: true,
      reviews: true
    }
  })

  if (!existUser) {
    throw new AppError("User not found", 404);
  }
  return existUser;
}

const logOut = async (sessionToken: string) => {
  const result = await auth.api.signOut({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  })
  return result;
}



export const authService = {
  createUser,
  loginUser,
  getMe,
  logOut
}