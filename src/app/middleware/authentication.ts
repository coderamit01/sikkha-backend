import { Request, NextFunction, Response } from "express";
import { UserRole } from "../lib/auth";
import { AppError } from "../helpers/appError";
import { CookieUtils } from "../utils/cookies";
import { JwtUtils } from "../utils/jwt";
import { envVars } from "../config/env";
import { prisma } from "../lib/prisma";

const authentication = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionToken = CookieUtils.getCookie(req, "session_token");
      if (!sessionToken) {
        throw new AppError("Unauthorized: No session token provided.", 401);
      }

      if (sessionToken) {
        const sessionExist = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: {
              gt: new Date()
            }
          },
          include: { user: true }
        })

        if (sessionExist && sessionExist.user) {
          const user = sessionExist.user;

          const now = new Date();
          const expiresAt = new Date(sessionExist.expiresAt);
          const createdAt = new Date(sessionExist.createdAt);

          const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
          const remainingTime = expiresAt.getTime() - now.getTime();
          const percentageRemaining = (remainingTime / sessionLifeTime) * 100;

          if (percentageRemaining < 20) {
            res.setHeader('X-Session-Refresh', 'true');
            res.setHeader('X-Session-Expires-At', expiresAt.toISOString());
            res.setHeader('X-Time-Remaining', remainingTime.toString());
          }
          if (user.isBanned) {
            throw new AppError("Your account has been banned. Please contact support for more information.", 403);
          }

          req.user = {
            userId: user.id,
            name: user.name,
            email: user.email,
            role: user.role as UserRole,
          };

          if (roles.length && !roles.includes(req.user.role as UserRole)) {
            throw new AppError(
              "Forbidden: You do not have the necessary permissions to access this resource.",
              403,
            );
          }

        }
        const accessToken = CookieUtils.getCookie(req, 'accessToken');

        if (!accessToken) {
          throw new AppError("Unauthorized access! No access token provided.", 401);
        }
      }


      const accessToken = CookieUtils.getCookie(req, "accessToken");
      if (!accessToken) {
        throw new AppError("Unauthorized: No access token provided.", 401);
      }

      const verifyToken = JwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);
      if (!verifyToken.success) {
        throw new AppError("Unauthorized: Invalid access token.", 401);
      }


      if (roles.length && !roles.includes(req.user?.role as UserRole)) {
        throw new AppError(
          "Forbidden: You do not have the necessary permissions to access this resource.",
          403,
        );
      }

      next();
    } catch (error: any) {
      next(error);
    }
  };
};

export default authentication;
