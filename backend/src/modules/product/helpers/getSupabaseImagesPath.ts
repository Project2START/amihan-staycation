/**
 * Strips the Supabase storage base URL from a full image URL.
 * @param {string} imageUrl - The full URL of the image.
 * @returns {string} - The relative path of the image in storage.
 */
export function getSupabaseImagesPath(imageUrl: string) {
  const baseUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/images/`;
  return imageUrl.replace(baseUrl, "");
}
