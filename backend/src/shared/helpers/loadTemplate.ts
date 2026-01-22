import fs from "fs";

/**
 * Loads a text template from a file and replaces placeholders with provided values.
 * Placeholders in the template should be in the format `{{key}}`.
 *
 * @param filePath - Path to the template file.
 * @param replacements - An object mapping placeholder keys to their replacement strings.
 * @returns The template string with all placeholders replaced.
 */

export function loadTemplate(
  filePath: string,
  replacements: Record<string, string>
) {
  let template = fs.readFileSync(filePath, "utf-8");
  for (const key in replacements) {
    const regex = new RegExp(`{{${key}}}`, "g");
    template = template.replace(regex, replacements[key]);
  }
  return template;
}
