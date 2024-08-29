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
    for (let i = 0; i < 3; i++) {
      try {
        const query = `INSERT INTO customers DEFAULT VALUES;`;

        await client.query(query);
      } catch (error) {
        if (error) throw error;
      }
    }
    console.log("\n> Database seeded!");
  }

  await client.end();
}
