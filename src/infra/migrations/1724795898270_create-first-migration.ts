import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createType("measure_type_enum", ["water", "gas"]);

  pgm.createTable("customers", {
    customerCode: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
  });
  pgm.createTable("measures", {
    measureUuid: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    customerCode: {
      type: "uuid",
      notNull: true,
      references: '"customers"',
      onDelete: "CASCADE",
    },
    measureDatetime: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    measureType: {
      type: "measure_type_enum",
      notNull: true,
    },
    hasConfirmed: {
      type: "boolean",
      notNull: true,
      default: false,
    },
    imageUrl: {
      type: "text",
      notNull: true,
    },
  });
  pgm.createIndex("measures", "customerCode");
}

export async function down(): Promise<void> {}
