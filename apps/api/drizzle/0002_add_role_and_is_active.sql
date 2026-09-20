ALTER TABLE users ADD COLUMN `role` text DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE users ADD COLUMN `is_active` integer DEFAULT 1 NOT NULL;
