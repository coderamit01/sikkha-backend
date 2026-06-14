import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { authService } from "./auth.service";
import { tokenUtils } from "../../utils/token";
import { IRequestUser } from "../../interface/requestUser.interface";
import { CookieUtils } from "../../utils/cookies";


const createUser = catchAsync(
  async (req: Request, res: Response) => {

    const payload = req.body;
    const result = await authService.createUser(payload);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Register successfully",
      data: result
    })
  }
)

const loginUser = catchAsync(
  async (req: Request, res: Response) => {

    const payload = req.body;
    const result = await authService.loginUser(payload);
    const { accessToken, refreshToken, token, ...rest } = result;

    tokenUtils.setAccessTokenCookie(res, accessToken)
    tokenUtils.setRefreshTokenCookie(res, refreshToken)
    tokenUtils.setBetterAuthSessionCooke(res, token)

    sendResponse(res, {
      statusCode: 200, 
      success: true,
      message: "Login successfully",
      data: {
        ...rest,
        accessToken,
        refreshToken,
        token
      }
    })
  }
)

const getMe = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const result = await authService.getMe(user as IRequestUser);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Profile fetched successfully",
      data: result
    })
  }
)
const logOut = catchAsync(
  async (req: Request, res: Response) => {
    const betterAuthSessionToken = req.cookies["session_token"]
    const result = await authService.logOut(betterAuthSessionToken);

    CookieUtils.clearCookie(res, "accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })

    CookieUtils.clearCookie(res, "refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })

    CookieUtils.clearCookie(res, "session_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })


    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Logout successfully"
    })
  }
)


export const authController = {
  loginUser,
  createUser,
  getMe,
  logOut
}