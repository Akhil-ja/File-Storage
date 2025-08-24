import { Request, Response } from "express";
import { setTokenCookie, clearTokenCookie } from "../utils/cookieUtils";
import * as authService from "../services/authService";

export const registerUser = async (req: Request, res: Response, next: any) => {
  const { email, password } = req.body;

  try {
    const { user, tokens } = await authService.register(email, password);

    setTokenCookie(res, tokens.accessToken, tokens.refreshToken);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { userId: user._id },
    });
  } catch (error: any) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: any) => {
  const { email, password } = req.body;

  try {
    const { user, tokens } = await authService.login(email, password);

    setTokenCookie(res, tokens.accessToken, tokens.refreshToken);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: { userId: user._id },
    });
  } catch (error: any) {
    next(error);
  }
};

export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: any
) => {
  const refreshToken = req.cookies.refreshToken;

  try {
    const tokens = await authService.refresh(refreshToken);

    setTokenCookie(res, tokens.accessToken, tokens.refreshToken);

    res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
    });
  } catch (error: any) {
    next(error);
  }
};

export const logoutUser = (req: Request, res: Response) => {
  clearTokenCookie(res);
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
