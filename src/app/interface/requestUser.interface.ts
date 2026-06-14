import { DayOfWeek, Role } from "../../generated/prisma/enums";


export interface IRequestUser {
  userId: string,
  name: string,
  email: string,
  role: Role
}

export interface ITutorAvailability {
  day: DayOfWeek
  startTime: string;
  endTime: string;
}

export interface IUpdateTutorAvailability {
  startTime?: Date;
  endTime?: Date;
}
