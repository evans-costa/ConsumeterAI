import { generateAiResult } from "../utils/generateAIResult";
import { generateImage } from "../utils/generateImage";
import { uploadFile } from "../utils/uploadFile";

export class UploadService {
  async handleUpload(image: string) {
    const savedImage = await generateImage(
      image,
      "../../public/images/temp-image.jpg",
    );
    const file = await uploadFile(savedImage);
    const response = await generateAiResult(file);

    return {
      image_url: file.file.uri,
      measure_value: parseInt(response),
    };
  }
}
