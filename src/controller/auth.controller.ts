import { NextFunction, Request, RequestHandler, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User.model";
import { UserRole } from "../constants/user.constant";
import { AuthRequest, IUser } from "../types/user.type";
import { generateToken } from "../utils/generateToken.util";

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const user = await User.find().lean();
    if (!user) {
      res.status(404).json({ error: "No user not found" });

      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "User already exists" });

      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: passwordHash,
      role: role || UserRole.USER,
      createdAt: new Date(),
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const signUpUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: "Invalid email or password" });

      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: "Invalid email or password" });

      return;
    }

    const token = generateToken({ id: user._id, email: user.email, role: user.role });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const authenticateJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as IUser;

    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token", details: err });
    return;
  }
};

export const authenticateMiddleware: RequestHandler = (req, res, next) => {
  authenticateJWT(req as any, res, next);
};
