import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const region = process.env.AWS_BUCKET_REGION as string;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID as string;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY as string;

const s3Client = new S3Client({
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

export { s3Client };
