import { v4 as uuidv4 } from "uuid";
import AppError from "../utils/AppError";
import { IFile, IUser } from "../types/common";
import File from "../models/File";
import {
  uploadFileToS3,
  getSignedUrlFromS3,
  deleteFileFromS3,
} from "../utils/s3Utils";

export const upload = async (
  file: Express.Multer.File,
  user: IUser
): Promise<IFile> => {
  const s3Key = `${uuidv4()}-${Date.now()}-${file.originalname}`;

  try {
    await uploadFileToS3(file.buffer, s3Key, file.mimetype);

    const newFile = await File.create({
      fileName: file.originalname,
      originalName: file.originalname,
      s3Key: s3Key,
      size: file.size,
      fileType: file.mimetype,
      uploadedBy: user._id,
    });

    return newFile;
  } catch (error: any) {
    console.error("Original S3 upload error:", error);
    throw new AppError("File upload failed", 500);
  }
};

export const getFiles = async (
  user: IUser,
  search: string,
  page: number,
  limit: number,
  fileType: string
): Promise<{ files: IFile[]; total: number }> => {
  try {
    const query: any = { uploadedBy: user._id };

    if (search) {
      query.originalName = { $regex: search, $options: "i" };
    }

    if (fileType) {
      query.fileType = fileType;
    }

    const files = await File.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    const total = await File.countDocuments(query);

    return { files, total };
  } catch (error: any) {
    console.error("Original S3 getFiles error:", error);
    throw new AppError("Failed to retrieve files", 500);
  }
};

export const downloadFile = async (
  fileId: string,
  user: IUser,
  disposition: "inline" | "attachment" = "attachment"
): Promise<string> => {
  try {
    const file = await File.findById(fileId);

    if (!file || file.uploadedBy.toString() !== user._id.toString()) {
      throw new AppError("File not found or unauthorized", 404);
    }

    const signedUrl = await getSignedUrlFromS3(
      file.s3Key,
      file.originalName,
      disposition
    );

    return signedUrl;
  } catch (error: any) {
    console.error("Original S3 download/view error:", error);
    throw new AppError("Failed to generate download URL", 500);
  }
};

export const deleteFile = async (
  fileId: string,
  user: IUser
): Promise<void> => {
  try {
    const file = await File.findById(fileId);

    if (!file || file.uploadedBy.toString() !== user._id.toString()) {
      throw new AppError("File not found or unauthorized", 404);
    }

    await deleteFileFromS3(file.s3Key);
    await file.deleteOne();
  } catch (error: any) {
    console.error("Original S3 delete error:", error);
    throw new AppError("Failed to delete file", 500);
  }
};
