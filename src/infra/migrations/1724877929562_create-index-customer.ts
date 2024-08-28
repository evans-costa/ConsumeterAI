import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.dropIndex("measures", "customerCode");

  // Crie um novo índice na nova coluna renomeada
  pgm.createIndex("measures", "customer_code");
}

export async function down(): Promise<void> {}
