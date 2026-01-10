import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";

// Jobs table - tracks wallpaper generation jobs
export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: varchar("session_id", { length: 255 }), // For anonymous users
  userId: uuid("user_id").references(() => users.id),
  status: varchar("status", { length: 20 }).default("pending").notNull(),
  location: jsonb("location").notNull(), // {lat, lng, zoom, bearing, pitch}
  style: varchar("style", { length: 50 }).notNull(),
  devices: text("devices").array().notNull(),
  aiEnabled: boolean("ai_enabled").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  errorMessage: text("error_message"),
});

// Generated images table
export const images = pgTable("images", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobId: uuid("job_id")
    .references(() => jobs.id, { onDelete: "cascade" })
    .notNull(),
  device: varchar("device", { length: 20 }).notNull(),
  storageKey: varchar("storage_key", { length: 255 }).notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Users table (optional, for pro features)
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  paddleCustomerId: varchar("paddle_customer_id", { length: 255 }),
  subscriptionStatus: varchar("subscription_status", { length: 20 }).default(
    "free"
  ),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Type exports for use in application
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
export type Image = typeof images.$inferSelect;
export type NewImage = typeof images.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
