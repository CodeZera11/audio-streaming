CREATE TABLE IF NOT EXISTS "media" (
	"id" uuid PRIMARY KEY NOT NULL,
	"fileName" text NOT NULL,
	"location" text NOT NULL,
	"created_at" timestamp DEFAULT '2025-02-08 11:24:30.689',
	"updated_at" timestamp DEFAULT '2025-02-08 11:24:30.689'
);
