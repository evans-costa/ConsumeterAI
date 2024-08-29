import database from "../infra/database";

export class MeasuresRepository {
  async createMeasure(
    customer_code: string,
    measure_datetime: Date,
    measure_type: string,
    measure_value: number,
    image_url: string,
  ) {
    const queryCreateMeasure = {
      text: `INSERT INTO measures (customer_code, measure_datetime, measure_type, measure_value, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING image_url, measure_value, measure_uuid;`,
      values: [
        customer_code,
        measure_datetime,
        measure_type,
        measure_value,
        image_url,
      ],
    };

    const result = await database.query(queryCreateMeasure);
    return result.rows[0];
  }

  async getMeasuresByCustomerCodeAndType(
    customer_code: string,
    measure_type?: string,
  ) {
    const query = {
      text: `SELECT measure_uuid, measure_datetime, measure_type, has_confirmed, image_url FROM measures WHERE customer_code = $1`,
      values: [customer_code],
    };

    if (measure_type) {
      query.text += " AND measure_type = $2";
      query.values.push(measure_type);
    }

    const result = await database.query(query);

    return result.rows;
  }

  async getMeasureByMonth(
    customer_code: string,
    measure_datetime: Date,
    measure_type: string,
  ) {
    const query = {
      text: `SELECT customer_code, measure_datetime, measure_type FROM measures WHERE customer_code = $1 
        AND EXTRACT(MONTH FROM measure_datetime) = EXTRACT(MONTH FROM $2::timestamp) 
        AND measure_type = $3;`,
      values: [customer_code, measure_datetime, measure_type],
    };

    const result = await database.query(query);

    return result;
  }

  async getMeasureByIdAndConfirmed(measure_uuid: string) {
    const queryFindMeasureData = {
      text: `SELECT measure_uuid, has_confirmed FROM measures WHERE measure_uuid = $1;`,
      values: [measure_uuid],
    };

    const result = await database.query(queryFindMeasureData);

    return result;
  }

  async updateMeasure(measure_uuid: string, confirmed_value: number) {
    const queryCreateMeasure = {
      text: `UPDATE measures SET measure_value = $1, has_confirmed = $2 WHERE measure_uuid = $3`,
      values: [confirmed_value, true, measure_uuid],
    };

    await database.query(queryCreateMeasure);
  }
}
