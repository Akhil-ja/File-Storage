import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types/common';

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);