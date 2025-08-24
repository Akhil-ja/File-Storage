import { Upload } from "@aws-sdk/lib-storage";
import { GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../config/awsS3";

export const uploadFileToS3 = async (
  fileBuffer: Buffer,
  s3Key: string,
  contentType: string
): Promise<void> => {
  const parallelUploads3 = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: s3Key,
      Body: fileBuffer,
      ContentType: contentType,
    },
  });

  parallelUploads3.on("httpUploadProgress", (progress) => {
    console.log(progress);
  });

  await parallelUploads3.done();
};

export const getSignedUrlFromS3 = async (
  s3Key: string,
  originalName: string,
  disposition: "inline" | "attachment" = "attachment"
): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: s3Key,
    ResponseContentDisposition: `${disposition}; filename="${originalName}"`,
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return signedUrl;
};

export const deleteFileFromS3 = async (s3Key: string): Promise<void> => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: s3Key,
  });

  await s3Client.send(command);
};
