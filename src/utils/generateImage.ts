import { Buffer } from "buffer";
import { writeFile } from "fs/promises";
import * as path from "node:path";

export async function generateImage(
  data: string,
  filePath: string,
): Promise<string> {
  const __dirname = path.dirname(__filename);

  const imagePath = path.join(__dirname, filePath);

  const buffer = Buffer.from(data, "base64");

  await writeFile(imagePath, buffer);

  return imagePath;
}
