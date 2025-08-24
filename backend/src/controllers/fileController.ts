import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';
import * as fileService from '../services/fileService';

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next(new AppError('No file uploaded', 400));
  }
  if (!req.user) {
    return next(new AppError('User not authenticated', 401));
  }

  try {
    const newFile = await fileService.upload(req.file, req.user);
    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: newFile,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getFiles = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError('User not authenticated', 401));
  }
  try {
    const files = await fileService.getFiles(req.user);
    res.status(200).json({
      success: true,
      message: 'Files retrieved successfully',
      data: files,
    });
  } catch (error: any) {
    next(error);
  }
};

export const downloadFile = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!req.user) {
    return next(new AppError('User not authenticated', 401));
  }

  try {
    const signedUrl = await fileService.downloadFile(id, req.user);
    res.status(200).json({
      success: true,
      message: 'Download URL generated successfully',
      data: { url: signedUrl },
    });
  } catch (error: any) {
    next(error);
  }
};

export const deleteFile = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!req.user) {
    return next(new AppError('User not authenticated', 401));
  }

  try {
    await fileService.deleteFile(id, req.user);
    res.status(200).json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error: any) {
    next(error);
  }
};
