/**
 * Converts an array of image URLs into File objects
 * Failed URLs are skipped
 * @param urls Array of image URLs
 * @returns Promise<File[]> - array of successfully converted File objects
 */
export async function urlsToFiles(urls: string[]): Promise<File[]> {
  const files: File[] = [];

  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch ${url}`);

      const blob = await response.blob();
      const filename = url.split("/").pop() || "file";

      const file = new File([blob], filename, { type: blob.type });
      files.push(file);
    } catch (error) {
      console.warn("Failed to convert URL to file:", url, error);
      // Skip this URL and continue with others
    }
  }

  return files; // empty array if all failed
}
