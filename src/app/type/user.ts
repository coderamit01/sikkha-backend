import { IRequestUser } from "../interface/requestUser.interface";

declare global {
  namespace Express {
    interface Request {
      user?: IRequestUser;
    }
  }
}
