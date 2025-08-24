import mongoose, { Schema } from 'mongoose';
import { IFile } from '../types/common';

const FileSchema: Schema = new Schema(
  {
    fileName: { type: String, required: true },
    originalName: { type: String, required: true },
    s3Key: { type: String, required: true, unique: true },
    size: { type: Number, required: true },
    fileType: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IFile>('File', FileSchema);