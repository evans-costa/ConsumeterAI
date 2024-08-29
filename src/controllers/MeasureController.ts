import { FastifyInstance } from "fastify";
import { MeasureService } from "../services/MeasureService";
import { z } from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export class MeasureController {
  async uploadMeasure(app: FastifyInstance) {
    const measureService = new MeasureService();

    app.withTypeProvider<ZodTypeProvider>().post(
      "/upload",
      {
        schema: {
          summary: "Cria uma leitura com base na imagem lida pela AI",
          tags: ["measures"],
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
            400: z.object({
              error_code: z.string(),
              error_description: z.record(z.string(), z.array(z.string())),
            }),
            409: z.object({
              error_code: z.string(),
              error_description: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { image, customer_code, measure_datetime, measure_type } =
          request.body;

        const newMeasure = await measureService.createMeasure(
          image,
          customer_code,
          measure_datetime,
          measure_type,
        );

        return reply.status(200).send({
          image_url: newMeasure.image_url,
          measure_value: newMeasure.measure_value,
          measure_uuid: newMeasure.measure_uuid,
        });
      },
    );
  }

  async listMeasures(app: FastifyInstance) {
    const measureService = new MeasureService();

    app.withTypeProvider<ZodTypeProvider>().get(
      "/:customer_code/list",
      {
        schema: {
          summary: "Lista todas as leituras pelo código do consumidor",
          tags: ["measures"],
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
            400: z.object({
              error_code: z.string(),
              error_description: z
                .record(z.string(), z.array(z.string()))
                .or(z.string()),
            }),
            404: z.object({
              error_code: z.string(),
              error_description: z.string(),
            }),
          },
        },
      },

      async (request, reply) => {
        const { customer_code } = request.params;
        const { measure_type } = request.query;

        const measures = await measureService.listMeasures(
          customer_code,
          measure_type,
        );

        return reply.status(200).send({
          customer_code,
          measures,
        });
      },
    );
  }

  async confirmMeasure(app: FastifyInstance) {
    const measureService = new MeasureService();

    app.withTypeProvider<ZodTypeProvider>().patch(
      "/confirm",
      {
        schema: {
          summary: "Confirma o valor de uma leitura",
          tags: ["measures"],
          body: z.object({
            measure_uuid: z.string().uuid(),
            confirmed_value: z.number().int(),
          }),
          response: {
            200: z.object({
              success: z.boolean(),
            }),
            400: z.object({
              error_code: z.string(),
              error_description: z.record(z.string(), z.array(z.string())),
            }),
            404: z.object({
              error_code: z.string(),
              error_description: z.string(),
            }),
            409: z.object({
              error_code: z.string(),
              error_description: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { measure_uuid, confirmed_value } = request.body;

        await measureService.updateMeasure(measure_uuid, confirmed_value);

        return reply.status(200).send({
          success: true,
        });
      },
    );
  }
}
