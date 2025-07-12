import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  guestSearchSchema,
  rsvpSubmissionSchema,
  insertGuestbookMessageSchema,
  adminLoginSchema,
  insertGuestSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Guest search endpoint
  app.post("/api/guests/search", async (req, res) => {
    try {
      const { firstName, lastName } = guestSearchSchema.parse(req.body);
      
      const guest = await storage.getGuestByName(firstName, lastName);
      
      if (!guest) {
        return res.status(404).json({ message: "Guest not found" });
      }

      res.json(guest);
    } catch (error) {
      console.error("Error searching guest:", error);
      res.status(400).json({ message: "Invalid search parameters" });
    }
  });

  // Submit RSVP
  app.post("/api/rsvp", async (req, res) => {
    try {
      const { guestId, rsvpStatus, personalMessage, plusGuests: plusGuestsData } = rsvpSubmissionSchema.parse(req.body);
      
      // Update guest RSVP
      const updatedGuest = await storage.updateGuestRSVP(guestId, rsvpStatus, personalMessage);
      
      if (!updatedGuest) {
        return res.status(404).json({ message: "Guest not found" });
      }

      // Delete existing plus guests
      await storage.deletePlusGuestsByGuestId(guestId);

      // Add new plus guests if attending
      if (rsvpStatus === "attending" && plusGuestsData && plusGuestsData.length > 0) {
        for (const plusGuestData of plusGuestsData) {
          await storage.createPlusGuest({
            guestId,
            name: plusGuestData.name,
            relationship: plusGuestData.relationship || "",
          });
        }
      }

      res.json({ message: "RSVP submitted successfully" });
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      res.status(400).json({ message: "Invalid RSVP data" });
    }
  });

  // Get approved guestbook messages
  app.get("/api/guestbook", async (req, res) => {
    try {
      const messages = await storage.getApprovedGuestbookMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching guestbook messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Submit guestbook message
  app.post("/api/guestbook", async (req, res) => {
    try {
      const messageData = insertGuestbookMessageSchema.parse(req.body);
      
      const newMessage = await storage.createGuestbookMessage(messageData);
      
      res.json({ 
        message: "Message submitted for review",
        id: newMessage.id
      });
    } catch (error) {
      console.error("Error submitting guestbook message:", error);
      res.status(400).json({ message: "Invalid message data" });
    }
  });

  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = adminLoginSchema.parse(req.body);
      
      // Use database authentication
      const admin = await storage.getAdminByUsername(username);
      
      if (admin && admin.password === password) {
        res.json({ message: "Login successful", token: "demo-token" });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Error during admin login:", error);
      res.status(400).json({ message: "Invalid login data" });
    }
  });

  // Admin endpoints (in production, these would be protected with auth middleware)
  
  // Get all guests
  app.get("/api/admin/guests", async (req, res) => {
    try {
      const guests = await storage.getAllGuests();
      res.json(guests);
    } catch (error) {
      console.error("Error fetching guests:", error);
      res.status(500).json({ message: "Failed to fetch guests" });
    }
  });

  // Add new guest
  app.post("/api/admin/guests", async (req, res) => {
    try {
      const guestData = insertGuestSchema.parse(req.body);
      
      const newGuest = await storage.createGuest(guestData);
      
      res.json(newGuest);
    } catch (error) {
      console.error("Error creating guest:", error);
      res.status(400).json({ message: "Invalid guest data" });
    }
  });

  // Delete guest
  app.delete("/api/admin/guests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid guest ID" });
      }

      const deleted = await storage.deleteGuest(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Guest not found" });
      }

      res.json({ message: "Guest deleted successfully" });
    } catch (error) {
      console.error("Error deleting guest:", error);
      res.status(500).json({ message: "Failed to delete guest" });
    }
  });

  // Get all guestbook messages (admin)
  app.get("/api/admin/guestbook", async (req, res) => {
    try {
      const messages = await storage.getAllGuestbookMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching all guestbook messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Approve guestbook message
  app.put("/api/admin/guestbook/:id/approve", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid message ID" });
      }

      const approvedMessage = await storage.approveGuestbookMessage(id);
      
      if (!approvedMessage) {
        return res.status(404).json({ message: "Message not found" });
      }

      res.json(approvedMessage);
    } catch (error) {
      console.error("Error approving message:", error);
      res.status(500).json({ message: "Failed to approve message" });
    }
  });

  // Delete guestbook message
  app.delete("/api/admin/guestbook/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid message ID" });
      }

      const deleted = await storage.deleteGuestbookMessage(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Message not found" });
      }

      res.json({ message: "Message deleted successfully" });
    } catch (error) {
      console.error("Error deleting message:", error);
      res.status(500).json({ message: "Failed to delete message" });
    }
  });

  // Get statistics
  app.get("/api/admin/statistics", async (req, res) => {
    try {
      const statistics = await storage.getGuestStatistics();
      res.json(statistics);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
