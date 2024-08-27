/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client, QueryResult } from "pg";

type QueryObject =
  | string
  | {
      text: string;
      values?: any[];
    };

async function query(queryObject: QueryObject): Promise<QueryResult<any>> {
  let client: Client | null = null;

  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    if (client) await client.end();
  }
}

async function getNewClient(): Promise<Client> {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  });

  await client.connect();
  return client;
}

const database = { query };

export default database;
