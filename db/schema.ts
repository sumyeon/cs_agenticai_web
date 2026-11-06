import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
export const inquiries = sqliteTable("inquiries", {
  id: text("id").primaryKey(),
  createdAt: integer("created_at").notNull(),
  name: text("name").notNull(),
  company: text("company").notNull(),
  email: text("email").notNull(),
  interest: text("interest").notNull(),
  message: text("message").notNull(),
  consentAt: integer("consent_at").notNull(),
  notificationStatus: text("notification_status").notNull(),
  notificationTokenHash: text("notification_token_hash"),
}, (table) => [index("inquiries_email_created_idx").on(table.email, table.createdAt)]);
