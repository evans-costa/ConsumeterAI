import { GoogleGenerativeAI } from "@google/generative-ai";
import { UploadFileResponse } from "@google/generative-ai/server";

export async function generateAiResult(
  uploadResponse: UploadFileResponse,
): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const prompt =
    "Me dê os números que estão dentro das caixas em preto nessa imagem do medidor, descartando os zeros a esquerda, me dê apenas o resultado numérico, sem ponto final.";

  const result = await model.generateContent([
    {
      fileData: {
        mimeType: uploadResponse.file.mimeType,
        fileUri: uploadResponse.file.uri,
      },
    },
    { text: prompt },
  ]);

  return result.response.text();
}
