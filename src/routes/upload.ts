import database from "../infra/database.js";
import { Conflict } from "../_errors/index.js";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { uploadFile } from "../utils/uploadFile.js";
import { generateImage } from "../utils/generateImage.js";
import { generateAiResult } from "../utils/generateAIResult.js";

export async function upload(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/upload",
    {
      schema: {
        body: z.object({
          image: z.string().min(1).base64(),
          customer_code: z.string().uuid(),
          measure_datetime: z.coerce.date(),
          measure_type: z.enum(["water", "gas"]),
        }),
        response: {
          200: z.object({
            image_url: z.string(),
            measure_value: z.number().int(),
            measure_uuid: z.string().uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { image, customer_code, measure_datetime, measure_type } =
        request.body;

      const queryFindMeasureData = {
        text: `SELECT customer_code, measure_datetime, measure_type FROM measures WHERE customer_code = $1 
        AND EXTRACT(MONTH FROM measure_datetime) = EXTRACT(MONTH FROM $2::timestamp) 
        AND measure_type = $3;`,
        values: [customer_code, measure_datetime, measure_type],
      };

      const measureAlreadyExists = await database.query(queryFindMeasureData);

      if (
        measureAlreadyExists.rowCount !== null &&
        measureAlreadyExists.rowCount > 0
      ) {
        throw new Conflict("DOUBLE_REPORT", "Leitura do mês já realizada");
      }

      const savedImage = await generateImage(
        image,
        "../../public/images/temp-image.jpg",
      );

      const file = await uploadFile(savedImage);
      const response = await generateAiResult(file);

      const queryCreateMeasure = {
        text: `INSERT INTO measures (customer_code, measure_datetime, measure_type, measure_value, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING image_url, measure_value, measure_uuid;`,
        values: [
          customer_code,
          measure_datetime,
          measure_type,
          parseInt(response),
          file.file.uri,
        ],
      };

      const resultMeasureCreated = await database.query(queryCreateMeasure);
      const newMeasure = resultMeasureCreated.rows[0];

      return reply.status(200).send({
        image_url: newMeasure.image_url,
        measure_value: newMeasure.measure_value,
        measure_uuid: newMeasure.measure_uuid,
      });
    },
  );
}
