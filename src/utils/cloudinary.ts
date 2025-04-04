import cloudinary from "cloudinary";
import fs from "node:fs/promises";
import { env } from "./env";

cloudinary.v2.config({
  secure: true,
  cloud_name: env("CLOUDINARY_NAME"),
  api_key: env("CLOUDINARY_API_KEY"),
  api_secret: env("CLOUDINARY_API_SECRET"),
});

export { cloudinary };

export const saveFileToCloudinary = async (
  file: Express.Multer.File,
): Promise<string> => {
  const result = await cloudinary.v2.uploader.upload(file.path, {
    folder: "it-traveler-markers",
  });
  await fs.unlink(file.path);
  return result.secure_url;
};
