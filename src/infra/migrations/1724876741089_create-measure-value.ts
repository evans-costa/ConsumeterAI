import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumns("measures", {
    measure_value: {
      type: "integer",
      notNull: false,
    },
  });
}

export async function down(): Promise<void> {}
