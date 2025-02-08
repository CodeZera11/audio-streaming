// database.ts
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { drizzle as drizzleOrm } from "drizzle-orm/node-postgres";

// Create SQLDatabase instance with migrations configuration
const db = new SQLDatabase("test", {
  migrations: {
    path: "migrations",
    source: "drizzle",
  },
});

// Initialize Drizzle ORM with the connection string
const drizzle = drizzleOrm(db.connectionString);

export { drizzle };
