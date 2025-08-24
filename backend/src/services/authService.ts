import User from "../models/User";
import { hashPassword, comparePassword } from "../utils/passwordUtils";
import generateTokens from "../utils/generateToken";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError";
import { IUser } from "../types/common";
import { AuthTokens } from "../types/common";

export const register = async (
  email: string,
  password: string
): Promise<{ user: IUser; tokens: AuthTokens }> => {
  let user = await User.findOne({ email });

  if (user) {
    throw new AppError("User already exists", 400);
  }

  const hashedPassword = await hashPassword(password);

  user = await User.create({
    email,
    password: hashedPassword,
  });

  const tokens = generateTokens(user._id as string);

  return { user, tokens };
};

export const login = async (
  email: string,
  password: string
): Promise<{ user: IUser; tokens: AuthTokens }> => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("Invalid credentials", 400);
  }

  const isMatch = await comparePassword(password, user.password as string);

  if (!isMatch) {
    throw new AppError("Invalid credentials", 400);
  }

  const tokens = generateTokens(user._id as string);

  return { user, tokens };
};

export const refresh = async (refreshToken: string): Promise<AuthTokens> => {
  if (!refreshToken) {
    throw new AppError("No refresh token provided", 401);
  }

  try {
    const decoded: any = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET as string
    );
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new AppError("Invalid refresh token", 401);
    }

    const tokens = generateTokens(user._id as string);

    return tokens;
  } catch (error: any) {
    throw new AppError("Not authorized, refresh token failed", 401);
  }
};
