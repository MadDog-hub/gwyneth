import {
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

export class MemoryStorage implements IStorage {
  private guests: Guest[] = [];
  private plusGuests: PlusGuest[] = [];
  private guestbookMessages: GuestbookMessage[] = [];
  private admins: Admin[] = [];
  private nextGuestId = 1;
  private nextPlusGuestId = 1;
  private nextGuestbookMessageId = 1;
  private nextAdminId = 1;

  async getGuest(id: number): Promise<Guest | undefined> {
    return this.guests.find(g => g.id === id);
  }

  async getGuestByName(firstName: string, lastName: string): Promise<GuestWithPlusGuests | undefined> {
    const normalizedFirstName = firstName.trim().toLowerCase();
    const normalizedLastName = lastName.trim().toLowerCase();

    const guest = this.guests.find(g =>
      g.firstName.trim().toLowerCase() === normalizedFirstName &&
      g.lastName.trim().toLowerCase() === normalizedLastName
    );

    if (!guest) return undefined;

    const guestPlusGuests = this.plusGuests.filter(pg => pg.guestId === guest.id);

    return {
      ...guest,
      plusGuests: guestPlusGuests,
    };
  }

  async createGuest(guest: InsertGuest): Promise<Guest> {
    const newGuest: Guest = {
      ...guest,
      id: this.nextGuestId++,
      allowedPlusGuests: guest.allowedPlusGuests ?? 0,
      rsvpStatus: guest.rsvpStatus ?? null,
      personalMessage: guest.personalMessage ?? null,
      submittedAt: guest.submittedAt ?? null,
      createdAt: new Date(),
    };
    this.guests.push(newGuest);
    return newGuest;
  }

  async updateGuestRSVP(id: number, rsvpStatus: string, personalMessage?: string, submittedAt?: Date): Promise<Guest | undefined> {
    const guest = this.guests.find(g => g.id === id);
    if (!guest) return undefined;

    guest.rsvpStatus = rsvpStatus;
    guest.personalMessage = personalMessage ?? null;
    guest.submittedAt = submittedAt || new Date();
    return guest;
  }

  async getAllGuests(): Promise<GuestWithPlusGuests[]> {
    return this.guests.map(guest => ({
      ...guest,
      plusGuests: this.plusGuests.filter(pg => pg.guestId === guest.id),
    }));
  }

  async deleteGuest(id: number): Promise<boolean> {
    const index = this.guests.findIndex(g => g.id === id);
    if (index === -1) return false;

    this.guests.splice(index, 1);
    this.plusGuests = this.plusGuests.filter(pg => pg.guestId !== id);
    return true;
  }

  async createPlusGuest(plusGuest: InsertPlusGuest): Promise<PlusGuest> {
    const newPlusGuest: PlusGuest = {
      ...plusGuest,
      id: this.nextPlusGuestId++,
      relationship: plusGuest.relationship ?? null,
      createdAt: new Date(),
    };
    this.plusGuests.push(newPlusGuest);
    return newPlusGuest;
  }

  async deletePlusGuestsByGuestId(guestId: number): Promise<void> {
    this.plusGuests = this.plusGuests.filter(pg => pg.guestId !== guestId);
  }

  async getApprovedGuestbookMessages(): Promise<GuestbookMessage[]> {
    return this.guestbookMessages
      .filter(msg => msg.isApproved)
      .sort((a, b) => (b.submittedAt?.getTime() ?? 0) - (a.submittedAt?.getTime() ?? 0));
  }

  async getAllGuestbookMessages(): Promise<GuestbookMessage[]> {
    return this.guestbookMessages
      .sort((a, b) => (b.submittedAt?.getTime() ?? 0) - (a.submittedAt?.getTime() ?? 0));
  }

  async createGuestbookMessage(message: InsertGuestbookMessage): Promise<GuestbookMessage> {
    const newMessage: GuestbookMessage = {
      ...message,
      id: this.nextGuestbookMessageId++,
      isApproved: false,
      submittedAt: new Date(),
      approvedAt: null,
    };
    this.guestbookMessages.push(newMessage);
    return newMessage;
  }

  async approveGuestbookMessage(id: number): Promise<GuestbookMessage | undefined> {
    const message = this.guestbookMessages.find(msg => msg.id === id);
    if (!message) return undefined;

    message.isApproved = true;
    message.approvedAt = new Date();
    return message;
  }

  async deleteGuestbookMessage(id: number): Promise<boolean> {
    const index = this.guestbookMessages.findIndex(msg => msg.id === id);
    if (index === -1) return false;

    this.guestbookMessages.splice(index, 1);
    return true;
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    return this.admins.find(a => a.username === username);
  }

  async createAdmin(admin: InsertAdmin): Promise<Admin> {
    const newAdmin: Admin = {
      ...admin,
      id: this.nextAdminId++,
      createdAt: new Date(),
    };
    this.admins.push(newAdmin);
    return newAdmin;
  }

  async getGuestStatistics(): Promise<{
    totalGuests: number;
    attendingGuests: number;
    notAttendingGuests: number;
    pendingRSVPs: number;
    totalPlusGuests: number;
  }> {
    const totalGuests = this.guests.length;
    const attendingGuests = this.guests.filter(g => g.rsvpStatus === "attending").length;
    const notAttendingGuests = this.guests.filter(g => g.rsvpStatus === "not_attending").length;
    const pendingRSVPs = this.guests.filter(g => !g.rsvpStatus).length;
    const totalPlusGuests = this.plusGuests.length;

    return {
      totalGuests,
      attendingGuests,
      notAttendingGuests,
      pendingRSVPs,
      totalPlusGuests,
    };
  }
}

export const storage = new MemoryStorage();
