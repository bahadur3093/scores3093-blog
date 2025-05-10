import { NextFunction, Request, RequestHandler, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User.model";
import { UserRole } from "../constants/user.constant";
import { AuthRequest, IUser } from "../types/user.type";
import { generateToken } from "../utils/generateToken.util";
import { registerUserValidation } from "../validations/users.validation";
import { TokenBlacklist } from "../models/Blaklist.model";

export const getAllUser = async (_req: Request, res: Response) => {
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
    const { error } = await registerUserValidation(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "User already registered. Please log in instead.",
        alreadyRegistered: true,
      });
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

    const token = generateToken({
      id: newUser._id,
      email: newUser.email,
      role: newUser.role,
    });

    res.status(201).json({
      success: true,
      alreadyRegistered: false,
      message: "User registered successfully",
      token,
    });
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

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const authenticateJWT = async (
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
    const blacklisted = await TokenBlacklist.findOne({ token });
    if (blacklisted) {
      res.status(401).json({ error: "Token has been invalidated" });
      return;
    }

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

export const logoutUser = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const decoded = jwt.decode(token) as { exp?: number };
    if (!decoded || !decoded.exp) {
      res.status(400).json({ error: "Invalid token" });
      return;
    }

    const expiresAt = new Date(decoded.exp * 1000);
    await TokenBlacklist.create({ token, expiresAt });

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password").lean();
    if (!user) {
      res.status(404).json({ error: "User not found" });

      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const validateToken = async (req: AuthRequest, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const decoded = jwt.decode(token) as { exp?: number };
    if (!decoded || !decoded.exp) {
      res.status(200).json({ isValid: false });
      return;
    }

    const expiresAt = new Date(decoded.exp * 1000);
    if (expiresAt < new Date()) {
      res.status(200).json({ isValid: false });
      return;
    }

    res.status(200).json({ isValid: true });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
