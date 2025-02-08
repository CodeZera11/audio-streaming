// schema.ts
import * as p from "drizzle-orm/pg-core";

export const media = p.pgTable("media", {
  id: p.uuid().primaryKey().defaultRandom(),
  fileName: p.text().notNull(),
  location: p.text().notNull(),
  created_at: p.timestamp().default(new Date()),
  updated_at: p.timestamp().default(new Date()),
});
