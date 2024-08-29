import database from "../infra/database";
import { Conflict, NotFound } from "../_errors/index";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function confirm(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    "/confirm",
    {
      schema: {
        body: z.object({
          measure_uuid: z.string().uuid(),
          confirmed_value: z.number().int(),
        }),
        response: {
          200: z.object({
            success: z.boolean(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { measure_uuid, confirmed_value } = request.body;

      const queryFindMeasureData = {
        text: `SELECT measure_uuid, measure_value, has_confirmed FROM measures WHERE measure_uuid = $1 
        AND measure_value = $2;`,
        values: [measure_uuid, confirmed_value],
      };

      const measure = await database.query(queryFindMeasureData);

      if (measure.rowCount === 0) {
        throw new NotFound("MEASURE_NOT_FOUND", "Leitura não encontrada");
      }

      if (measure.rows[0].has_confirmed === true) {
        throw new Conflict(
          "CONFIRMATION_DUPLICATE",
          "Leitura do mês já confirmada",
        );
      }

      const queryCreateMeasure = {
        text: `UPDATE measures SET measure_value = $1, has_confirmed = $2 WHERE measure_uuid = $3`,
        values: [confirmed_value, true, measure_uuid],
      };

      await database.query(queryCreateMeasure);

      return reply.status(200).send({
        success: true,
      });
    },
  );
}
