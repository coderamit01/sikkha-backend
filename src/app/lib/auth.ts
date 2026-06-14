import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { envVars } from "../config/env";
import { oAuthProxy } from "better-auth/plugins";

export enum UserRole {
  ADMIN = "ADMIN",
  STUDENT = "STUDENT",
  TUTOR = "TUTOR"
}



export const auth = betterAuth({
  baseURL: envVars.APP_URL,
  secret: envVars.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [envVars.APP_URL, envVars.BETTER_AUTH_URL],
  advanced: {
    cookies: {
      session_token: {
        name: "session_token",
        attributes: {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          partitioned: true,
        },
      },
      state: {
        name: "session_token",
        attributes: {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          partitioned: true,
        },
      },
    },
  },
  plugins: [oAuthProxy()],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24 // update every day
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: UserRole.STUDENT,
        required: true,
        input: true
      },
      isBanned: {
        type: "boolean",
        defaultValue: false,
        required: false,
      }
    }
  },
  emailAndPassword: {
    enabled: true
  }
});

type Session = typeof auth.$Infer.Session;