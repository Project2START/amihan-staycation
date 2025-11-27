import fs from "fs";

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
