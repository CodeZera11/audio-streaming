ALTER TABLE "media" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "media" ALTER COLUMN "created_at" SET DEFAULT '2025-02-08 11:37:00.963';--> statement-breakpoint
ALTER TABLE "media" ALTER COLUMN "updated_at" SET DEFAULT '2025-02-08 11:37:00.963';