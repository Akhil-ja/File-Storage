import mongoose from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export interface IUser extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  email: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFile extends mongoose.Document {
  fileName: string;
  originalName: string;
  s3Key: string;
  size: number;
  fileType: string;
  uploadedBy: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
