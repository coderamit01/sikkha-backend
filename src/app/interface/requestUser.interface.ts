import { Role } from "../../generated/prisma/enums";


export interface IRequestUser {
  userId: string,
  name: string,
  email: string,
  role: Role
}

export interface ITutorAvailability {
  startTime: Date;
  endTime: Date;
}

export interface IUpdateTutorAvailability {
  startTime?: Date;
  endTime?: Date;
}
