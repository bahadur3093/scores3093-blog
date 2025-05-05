import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "";

export const generateToken = (
  payload: object,
  expiresIn: number = 1 * 24 * 60 * 60
): string => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
  }

  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};
