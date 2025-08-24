import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.cookies.accessToken) {
    try {
      token = req.cookies.accessToken;

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error: any) {
      console.error(error);
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Access token expired" });
      }
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export { protect };
