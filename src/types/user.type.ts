import { Request } from "express";

import { UserRole } from "../constants/user.constant";

export interface IUser {
  id: string;
  email: string;
  role: UserRole
}

export interface AuthRequest extends Request {
  user: IUser;
}

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}
