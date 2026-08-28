import {v2 as cloudinary} from "cloudinary";
import dotenv from 'dotenv';


dotenv.config();

// Configure Cloudinary
// Cloudinary config removed - use server-side operations

// console.log("Cloudinary Config:", {
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
//   cloud_namee: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//   api_keyy: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
//   api_secrett: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
//   cloud_url: process.env.NEXT_PUBLIC_CLOUDINARY_URL,
// });

export class CloudStorageProvider {
  async upload(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {resource_type: "auto"},
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result && result.secure_url) {
            resolve(result.secure_url);
          } else {
            reject(new Error("Upload failed: No secure URL received"));
          }
        }
      );

      file
        .arrayBuffer()
        .then((arrayBuffer) => {
          const buffer = Buffer.from(arrayBuffer);
          uploadStream.end(buffer);
        })
        .catch(reject);
    });
  }
}

export const uploadToCloudStorage = async (
  provider: CloudStorageProvider,
  file: File
): Promise<string> => {
  try {
    const url = await provider.upload(file);
    return url;
  } catch (error) {
    console.error("Error uploading file to cloud storage:", error);
    throw error;
  }
};
