import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.renameColumn("customers", "customerCode", "customer_code");
  pgm.renameColumn("measures", "measureUuid", "measure_uuid");
  pgm.renameColumn("measures", "customerCode", "customer_code");
  pgm.renameColumn("measures", "measureDatetime", "measure_datetime");
  pgm.renameColumn("measures", "measureType", "measure_type");
  pgm.renameColumn("measures", "hasConfirmed", "has_confirmed");
  pgm.renameColumn("measures", "imageUrl", "image_url");
}

export async function down(): Promise<void> {}
