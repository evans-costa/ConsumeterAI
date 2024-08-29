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

  const uploadResponse = await fileManager.uploadFile(filePath, {
    mimeType: "image/jpeg",
    displayName: "Medidor",
  });

  return uploadResponse;
}
