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

// Re-export Better Auth schema tables
export * from "./auth-schema";

// Import Better Auth user table for references
import { user as authUser } from "./auth-schema";

// Jobs table - tracks wallpaper generation jobs
export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: varchar("session_id", { length: 255 }), // For anonymous users
  userId: text("user_id").references(() => authUser.id), // Reference Better Auth user
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
  imageData: text("image_data").notNull(), // Base64 encoded image
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Purchases table - tracks Polar payments and refunds
export const purchases = pgTable("purchases", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: varchar("order_id", { length: 255 }).unique().notNull(),
  customerId: varchar("customer_id", { length: 255 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  productId: varchar("product_id", { length: 255 }).notNull(),
  status: varchar("status", { length: 20 }).default("paid").notNull(), // paid, refunded
  paidAt: timestamp("paid_at"),
  refundedAt: timestamp("refunded_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Legacy users table - kept for migration, will be deprecated
// Better Auth uses its own "user" table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  paymentCustomerId: varchar("payment_customer_id", { length: 255 }),
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
export type LegacyUser = typeof users.$inferSelect;
export type NewLegacyUser = typeof users.$inferInsert;
export type Purchase = typeof purchases.$inferSelect;
export type NewPurchase = typeof purchases.$inferInsert;
