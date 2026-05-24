import { Express } from "express";
import { supabase } from "../lib/supabase";
import { generateFilePath } from "./generators/generateFilePath";

/**
 * Upload a file to Supabase storage.
 * @param file - Multer file object
 * @param folder - Folder name in storage
 * @returns { error, data } from Supabase upload
 */
import { BadRequestError } from "./appErrors";

export async function uploadFileToSupabase(
  file: Express.Multer.File,
  folder: string,
) {
  const filePath = generateFilePath(file, folder);

  //   console.log(file, filePath);
  const { error } = await supabase.storage
    .from("images")
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from("images").getPublicUrl(filePath);

  if (!data?.publicUrl) {
    throw new BadRequestError("Failed to generate public URL");
  }
  return { publicUrl: data.publicUrl, filePath };
}
