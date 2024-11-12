CREATE TABLE `tarot_cards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`upright_meaning` text NOT NULL,
	`reversed_meaning` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tarot_draw_cards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`draw_history_id` integer NOT NULL,
	`card_id` integer NOT NULL,
	`draw_order` integer NOT NULL,
	`orientation` text DEFAULT 'vertical' NOT NULL,
	`is_reversed` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`draw_history_id`) REFERENCES `tarot_draw_history`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`card_id`) REFERENCES `tarot_cards`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tarot_draw_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`spread_id` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`spread_id`) REFERENCES `tarot_spreads`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tarot_reading_results` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`draw_history_id` integer NOT NULL,
	`model_name` text NOT NULL,
	`question` text NOT NULL,
	`reading_result` text,
	`error_message` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`draw_history_id`) REFERENCES `tarot_draw_history`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tarot_spread_positions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`spread_id` integer NOT NULL,
	`draw_order` integer NOT NULL,
	`x` real NOT NULL,
	`y` real NOT NULL,
	`orientation` text DEFAULT 'vertical' NOT NULL,
	`description` text NOT NULL,
	`display_name` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`spread_id`) REFERENCES `tarot_spreads`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tarot_spreads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`googleUserId` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_googleUserId_unique` ON `users` (`googleUserId`);