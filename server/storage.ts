import {
  guests,
  plusGuests,
  guestbookMessages,
  admins,
  type Guest,
  type InsertGuest,
  type PlusGuest,
  type InsertPlusGuest,
  type GuestbookMessage,
  type InsertGuestbookMessage,
  type Admin,
  type InsertAdmin,
  type GuestWithPlusGuests,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // Guest operations
  getGuest(id: number): Promise<Guest | undefined>;
  getGuestByName(firstName: string, lastName: string): Promise<GuestWithPlusGuests | undefined>;
  createGuest(guest: InsertGuest): Promise<Guest>;
  updateGuestRSVP(id: number, rsvpStatus: string, personalMessage?: string, submittedAt?: Date): Promise<Guest | undefined>;
  getAllGuests(): Promise<GuestWithPlusGuests[]>;
  deleteGuest(id: number): Promise<boolean>;
  
  // Plus guest operations
  createPlusGuest(plusGuest: InsertPlusGuest): Promise<PlusGuest>;
  deletePlusGuestsByGuestId(guestId: number): Promise<void>;
  
  // Guestbook operations
  getApprovedGuestbookMessages(): Promise<GuestbookMessage[]>;
  getAllGuestbookMessages(): Promise<GuestbookMessage[]>;
  createGuestbookMessage(message: InsertGuestbookMessage): Promise<GuestbookMessage>;
  approveGuestbookMessage(id: number): Promise<GuestbookMessage | undefined>;
  deleteGuestbookMessage(id: number): Promise<boolean>;
  
  // Admin operations
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  
  // Statistics
  getGuestStatistics(): Promise<{
    totalGuests: number;
    attendingGuests: number;
    notAttendingGuests: number;
    pendingRSVPs: number;
    totalPlusGuests: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getGuest(id: number): Promise<Guest | undefined> {
    const [guest] = await db.select().from(guests).where(eq(guests.id, id));
    return guest || undefined;
  }

  async getGuestByName(firstName: string, lastName: string): Promise<GuestWithPlusGuests | undefined> {
    const [guest] = await db
      .select()
      .from(guests)
      .where(and(
        eq(guests.firstName, firstName),
        eq(guests.lastName, lastName)
      ));

    if (!guest) return undefined;

    const guestPlusGuests = await db
      .select()
      .from(plusGuests)
      .where(eq(plusGuests.guestId, guest.id));

    return {
      ...guest,
      plusGuests: guestPlusGuests,
    };
  }

  async createGuest(guest: InsertGuest): Promise<Guest> {
    const [newGuest] = await db
      .insert(guests)
      .values(guest)
      .returning();
    return newGuest;
  }

  async updateGuestRSVP(id: number, rsvpStatus: string, personalMessage?: string, submittedAt?: Date): Promise<Guest | undefined> {
    const [updatedGuest] = await db
      .update(guests)
      .set({
        rsvpStatus,
        personalMessage,
        submittedAt: submittedAt || new Date(),
      })
      .where(eq(guests.id, id))
      .returning();
    return updatedGuest || undefined;
  }

  async getAllGuests(): Promise<GuestWithPlusGuests[]> {
    const allGuests = await db.select().from(guests);
    const allPlusGuests = await db.select().from(plusGuests);

    return allGuests.map(guest => ({
      ...guest,
      plusGuests: allPlusGuests.filter(pg => pg.guestId === guest.id),
    }));
  }

  async deleteGuest(id: number): Promise<boolean> {
    const result = await db.delete(guests).where(eq(guests.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async createPlusGuest(plusGuest: InsertPlusGuest): Promise<PlusGuest> {
    const [newPlusGuest] = await db
      .insert(plusGuests)
      .values(plusGuest)
      .returning();
    return newPlusGuest;
  }

  async deletePlusGuestsByGuestId(guestId: number): Promise<void> {
    await db.delete(plusGuests).where(eq(plusGuests.guestId, guestId));
  }

  async getApprovedGuestbookMessages(): Promise<GuestbookMessage[]> {
    return await db
      .select()
      .from(guestbookMessages)
      .where(eq(guestbookMessages.isApproved, true))
      .orderBy(desc(guestbookMessages.submittedAt));
  }

  async getAllGuestbookMessages(): Promise<GuestbookMessage[]> {
    return await db
      .select()
      .from(guestbookMessages)
      .orderBy(desc(guestbookMessages.submittedAt));
  }

  async createGuestbookMessage(message: InsertGuestbookMessage): Promise<GuestbookMessage> {
    const [newMessage] = await db
      .insert(guestbookMessages)
      .values(message)
      .returning();
    return newMessage;
  }

  async approveGuestbookMessage(id: number): Promise<GuestbookMessage | undefined> {
    const [approvedMessage] = await db
      .update(guestbookMessages)
      .set({
        isApproved: true,
        approvedAt: new Date(),
      })
      .where(eq(guestbookMessages.id, id))
      .returning();
    return approvedMessage || undefined;
  }

  async deleteGuestbookMessage(id: number): Promise<boolean> {
    const result = await db.delete(guestbookMessages).where(eq(guestbookMessages.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const [admin] = await db
      .select()
      .from(admins)
      .where(eq(admins.username, username));
    return admin || undefined;
  }

  async createAdmin(admin: InsertAdmin): Promise<Admin> {
    const [newAdmin] = await db
      .insert(admins)
      .values(admin)
      .returning();
    return newAdmin;
  }

  async getGuestStatistics(): Promise<{
    totalGuests: number;
    attendingGuests: number;
    notAttendingGuests: number;
    pendingRSVPs: number;
    totalPlusGuests: number;
  }> {
    const allGuests = await db.select().from(guests);
    const allPlusGuests = await db.select().from(plusGuests);

    const totalGuests = allGuests.length;
    const attendingGuests = allGuests.filter(g => g.rsvpStatus === "attending").length;
    const notAttendingGuests = allGuests.filter(g => g.rsvpStatus === "not_attending").length;
    const pendingRSVPs = allGuests.filter(g => !g.rsvpStatus).length;
    const totalPlusGuests = allPlusGuests.length;

    return {
      totalGuests,
      attendingGuests,
      notAttendingGuests,
      pendingRSVPs,
      totalPlusGuests,
    };
  }
}

export const storage = new DatabaseStorage();
