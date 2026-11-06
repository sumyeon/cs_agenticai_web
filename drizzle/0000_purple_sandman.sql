CREATE TABLE `inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`name` text NOT NULL,
	`company` text NOT NULL,
	`email` text NOT NULL,
	`interest` text NOT NULL,
	`message` text NOT NULL,
	`consent_at` integer NOT NULL,
	`notification_status` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `inquiries_email_created_idx` ON `inquiries` (`email`,`created_at`);