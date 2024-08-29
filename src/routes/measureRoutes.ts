import { FastifyInstance } from "fastify";
import { MeasureController } from "../controllers/MeasureController";

export async function measureRoutes(app: FastifyInstance) {
  const measureController = new MeasureController();

  measureController.uploadMeasure(app);
  measureController.listMeasures(app);
  measureController.confirmMeasure(app);
}
