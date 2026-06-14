import { Gender, Role } from "../../../generated/prisma/enums"

export interface IRegisterPayload {
  name: string,
  email: string,
  password: string,
  role: Role,
  gender: Gender
}
export interface ILoginPayload {
  email: string,
  password: string
}

export interface IUpdateStatus {
  isBanned: boolean
}

