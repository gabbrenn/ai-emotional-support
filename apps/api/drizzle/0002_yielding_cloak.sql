PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_moods` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`mood` text DEFAULT 'okay' NOT NULL,
	`mood_score` integer DEFAULT 3 NOT NULL,
	`note` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_moods`("id", "user_id", "mood", "mood_score", "note", "created_at") SELECT "id", "user_id", "mood", "mood_score", "note", "created_at" FROM `moods`;--> statement-breakpoint
DROP TABLE `moods`;--> statement-breakpoint
ALTER TABLE `__new_moods` RENAME TO `moods`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `users` ADD `role` text DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `is_active` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `is_verified` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `verification_token` text;--> statement-breakpoint
ALTER TABLE `users` ADD `verification_token_expires_at` text;--> statement-breakpoint
ALTER TABLE `users` ADD `reset_password_token` text;--> statement-breakpoint
ALTER TABLE `users` ADD `reset_password_token_expires_at` text;