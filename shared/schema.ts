import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users Schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Services Schema
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  duration: integer("duration").notNull(), // in minutes
  imageUrl: text("image_url").notNull(),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
});

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

// Staff Schema
export const staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  bio: text("bio").notNull(),
  imageUrl: text("image_url"),
  initials: text("initials").notNull(),
  sessions: integer("sessions").default(0),
  rating: real("rating").default(0),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertStaffSchema = createInsertSchema(staff).omit({
  id: true,
  createdAt: true,
});

export type InsertStaff = z.infer<typeof insertStaffSchema>;
export type Staff = typeof staff.$inferSelect;

// Bookings Schema
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  serviceId: integer("service_id").notNull(),
  date: text("date").notNull(), // Store as YYYY-MM-DD
  time: text("time").notNull(), // Store as HH:MM in 24h format
  message: text("message"),
  status: text("status").default("pending"), // pending, confirmed, cancelled, completed
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

// Settings Schema
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  businessName: text("business_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  description: text("description"),
  mondayToFridayOpen: text("monday_to_friday_open").default("09:00"),
  mondayToFridayClose: text("monday_to_friday_close").default("20:00"),
  saturdayOpen: text("saturday_open").default("09:00"),
  saturdayClose: text("saturday_close").default("18:00"),
  sundayOpen: text("sunday_open").default("10:00"),
  sundayClose: text("sunday_close").default("17:00"),
  mondayToFridayEnabled: boolean("monday_to_friday_enabled").default(true),
  saturdayEnabled: boolean("saturday_enabled").default(true),
  sundayEnabled: boolean("sunday_enabled").default(true),
});

export const insertSettingsSchema = createInsertSchema(settings).omit({
  id: true,
});

export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;

// Define relations
export const servicesRelations = relations(services, ({ many }) => ({
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  service: one(services, {
    fields: [bookings.serviceId],
    references: [services.id],
  }),
}));
