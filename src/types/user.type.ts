import { Request } from "express";

import { UserRole } from "../constants/user.constant";

export interface IUser {
  id: string;
  email: string;
  role: UserRole
}
export type UserType = {
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  cover?: string;
};

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
