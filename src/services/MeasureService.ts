import { Conflict, NotFound } from "../_errors/index";
import { MeasuresRepository } from "../repositories/MeasureRepository";
import { UploadService } from "./UploadService";

export class MeasureService {
  private measureRepository: MeasuresRepository;
  private uploadService: UploadService;

  constructor() {
    this.measureRepository = new MeasuresRepository();
    this.uploadService = new UploadService();
  }

  async listMeasures(customer_code: string, measure_type?: string) {
    const measures =
      await this.measureRepository.getMeasuresByCustomerCodeAndType(
        customer_code,
        measure_type,
      );

    if (measures.length === 0) {
      throw new NotFound("MEASURES_NOT_FOUND", "Nenhuma leitura encontrada");
    }

    return measures.map((measure) => ({
      measure_uuid: measure.measure_uuid,
      measure_datetime: measure.measure_datetime,
      measure_type: measure.measure_type,
      has_confirmed: measure.has_confirmed,
      image_url: measure.image_url,
    }));
  }

  async createMeasure(
    image: string,
    customer_code: string,
    measure_datetime: Date,
    measure_type: string,
  ) {
    const getMeasureByDateMonth =
      await this.measureRepository.getMeasureByMonth(
        customer_code,
        measure_datetime,
        measure_type,
      );

    if (
      getMeasureByDateMonth.rowCount !== null &&
      getMeasureByDateMonth.rowCount > 0
    ) {
      throw new Conflict("DOUBLE_REPORT", "Leitura do mês já realizada");
    }

    const { image_url, measure_value } =
      await this.uploadService.handleUpload(image);

    return this.measureRepository.createMeasure(
      customer_code,
      measure_datetime,
      measure_type,
      measure_value,
      image_url,
    );
  }

  async updateMeasure(measure_uuid: string, confirmed_value: number) {
    const hasMeasureConfirmed =
      await this.measureRepository.getMeasureByIdAndConfirmed(measure_uuid);

    if (hasMeasureConfirmed.rowCount === 0) {
      throw new NotFound("MEASURE_NOT_FOUND", "Leitura não encontrada");
    }

    if (hasMeasureConfirmed.rows[0].has_confirmed === true) {
      throw new Conflict(
        "CONFIRMATION_DUPLICATE",
        "Leitura do mês já confirmada",
      );
    }

    return this.measureRepository.updateMeasure(measure_uuid, confirmed_value);
  }
}
