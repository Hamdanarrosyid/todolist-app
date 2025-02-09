ALTER TABLE "addresses" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "addresses" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "created_at" timestamp DEFAULT now();