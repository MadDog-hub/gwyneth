import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Guests table
export const guests = pgTable("guests", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").notNull(), // Friend, Family, Colleague, etc.
  allowedPlusGuests: integer("allowed_plus_guests").notNull().default(0),
  rsvpStatus: text("rsvp_status"), // "attending", "not_attending", null
  personalMessage: text("personal_message"),
  submittedAt: timestamp("submitted_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Plus guests table
export const plusGuests = pgTable("plus_guests", {
  id: serial("id").primaryKey(),
  guestId: integer("guest_id").notNull().references(() => guests.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  relationship: text("relationship"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Guestbook messages table
export const guestbookMessages = pgTable("guestbook_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  relationship: text("relationship").notNull(),
  message: text("message").notNull(),
  isApproved: boolean("is_approved").notNull().default(false),
  submittedAt: timestamp("submitted_at").defaultNow(),
  approvedAt: timestamp("approved_at"),
});

// Admin users table
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const guestsRelations = relations(guests, ({ many }) => ({
  plusGuests: many(plusGuests),
}));

export const plusGuestsRelations = relations(plusGuests, ({ one }) => ({
  guest: one(guests, {
    fields: [plusGuests.guestId],
    references: [guests.id],
  }),
}));

// Insert schemas
export const insertGuestSchema = createInsertSchema(guests).omit({
  id: true,
  createdAt: true,
});

export const insertPlusGuestSchema = createInsertSchema(plusGuests).omit({
  id: true,
  createdAt: true,
});

export const insertGuestbookMessageSchema = createInsertSchema(guestbookMessages).omit({
  id: true,
  submittedAt: true,
  approvedAt: true,
  isApproved: true,
});

export const insertAdminSchema = createInsertSchema(admins).omit({
  id: true,
  createdAt: true,
});

// Search schema for guest lookup
export const guestSearchSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

// RSVP submission schema
export const rsvpSubmissionSchema = z.object({
  guestId: z.number(),
  rsvpStatus: z.enum(["attending", "not_attending"]),
  personalMessage: z.string().optional(),
  plusGuests: z.array(z.object({
    name: z.string().min(1, "Plus guest name is required"),
    relationship: z.string().optional(),
  })).optional(),
});

// Admin login schema
export const adminLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Types
export type Guest = typeof guests.$inferSelect;
export type InsertGuest = z.infer<typeof insertGuestSchema>;
export type PlusGuest = typeof plusGuests.$inferSelect;
export type InsertPlusGuest = z.infer<typeof insertPlusGuestSchema>;
export type GuestbookMessage = typeof guestbookMessages.$inferSelect;
export type InsertGuestbookMessage = z.infer<typeof insertGuestbookMessageSchema>;
export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type GuestSearch = z.infer<typeof guestSearchSchema>;
export type RSVPSubmission = z.infer<typeof rsvpSubmissionSchema>;
export type AdminLogin = z.infer<typeof adminLoginSchema>;

// Guest with plus guests type for API responses
export type GuestWithPlusGuests = Guest & {
  plusGuests: PlusGuest[];
};
