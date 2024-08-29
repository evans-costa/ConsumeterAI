import database from "../infra/database";
import { NotFound } from "../_errors/index";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function list(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/:customer_code/list",
    {
      schema: {
        params: z.object({
          customer_code: z.string().uuid(),
        }),
        querystring: z.object({
          measure_type: z
            .string()
            .optional()
            .transform((val) => val?.toLowerCase())
            .refine((val) => !val || ["water", "gas"].includes(val)),
        }),
        response: {
          200: z.object({
            customer_code: z.string().uuid(),
            measures: z.array(
              z.object({
                measure_uuid: z.string().uuid(),
                measure_datetime: z.date(),
                measure_type: z.string(),
                has_confirmed: z.boolean(),
                image_url: z.string().url(),
              }),
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const { customer_code } = request.params;
      const { measure_type } = request.query;

      const queryFindMeasureData = {
        text: `SELECT measure_uuid, measure_datetime, measure_type, has_confirmed, image_url FROM measures WHERE customer_code = $1`,
        values: [customer_code],
      };

      if (measure_type) {
        queryFindMeasureData.text += " AND measure_type = $2";
        queryFindMeasureData.values.push(measure_type);
      }

      const result = await database.query(queryFindMeasureData);

      if (result.rowCount === 0) {
        throw new NotFound("MEASURES_NOT_FOUND", "Nenhuma leitura encontrada");
      }

      const measures = result.rows;

      return reply.status(200).send({
        customer_code,
        measures: measures.map((measure) => {
          return {
            measure_uuid: measure.measure_uuid,
            measure_datetime: measure.measure_datetime,
            measure_type: measure.measure_type,
            has_confirmed: measure.has_confirmed,
            image_url: measure.image_url,
          };
        }),
      });
    },
  );
}
