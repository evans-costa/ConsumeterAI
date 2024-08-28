import { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { Conflict, NotFound } from "./_errors";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    if (error.flatten().fieldErrors.measure_type) {
      return reply.status(400).send({
        error_code: "INVALID_TYPE",
        error_description: "Tipo de medição não permitida",
      });
    }

    return reply.status(400).send({
      error_code: "INVALID_DATA",
      errors: error.flatten().fieldErrors,
    });
  }

  if (error instanceof NotFound) {
    return reply.status(error.statusCode).send({
      error_code: error.error_code,
      error_description: error.error_description,
    });
  }

  if (error instanceof Conflict) {
    return reply.status(error.statusCode).send({
      error_code: error.error_code,
      error_description: error.error_description,
    });
  }

  return reply.status(500).send({ message: "Internal Server Error" });
};
