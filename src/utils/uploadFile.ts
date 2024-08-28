import mime from "mime";
import {
  GoogleAIFileManager,
  UploadFileResponse,
} from "@google/generative-ai/server";

export async function uploadFile(
  filePath: string,
): Promise<UploadFileResponse> {
  const fileManager = new GoogleAIFileManager(
    process.env.GEMINI_API_KEY as string,
  );

  const mimeType = mime.getType(filePath);

  const uploadResponse = await fileManager.uploadFile(filePath, {
    mimeType: mimeType as string,
    displayName: "Medidor",
  });

  return uploadResponse;
}
