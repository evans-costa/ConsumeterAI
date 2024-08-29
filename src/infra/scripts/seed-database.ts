import { Client } from "pg";

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

seedDatabase();

async function seedDatabase() {
  console.log("> Seeding database...");

  await client.connect();

  const findCustomersQuery = `SELECT * FROM customers;`;
  const result = await client.query(findCustomersQuery);

  if (result.rowCount !== null && result.rowCount > 0) {
    console.log("\n> Database already seeded!");
  } else {
    try {
      const query = `INSERT INTO customers (customer_code) VALUES ('33f02178-e1bd-466d-a9a6-fa3f56cacda1');`;

      await client.query(query);
    } catch (error) {
      if (error) throw error;
    }

    console.log("\n> Database seeded!");
  }

  await client.end();
}
