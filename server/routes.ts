import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), 'client/public/images');
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, req.body.filename);
    }
  })
});
import { 
  insertServiceSchema, 
  insertStaffSchema, 
  insertBookingSchema, 
  insertSettingsSchema 
} from "@shared/schema";
import { format, parseISO } from "date-fns";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  
  // Services
  app.get("/api/services", async (req: Request, res: Response) => {
    try {
      const services = await storage.getAllServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Error fetching services" });
    }
  });

  app.get("/api/services/featured", async (req: Request, res: Response) => {
    try {
      const services = await storage.getFeaturedServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Error fetching featured services" });
    }
  });

  app.get("/api/services/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const service = await storage.getService(id);
      
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      res.json(service);
    } catch (error) {
      res.status(500).json({ message: "Error fetching service" });
    }
  });

  app.post("/api/services", async (req: Request, res: Response) => {
    try {
      const parseResult = insertServiceSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid service data", errors: parseResult.error });
      }
      
      const newService = await storage.createService(parseResult.data);
      res.status(201).json(newService);
    } catch (error) {
      res.status(500).json({ message: "Error creating service" });
    }
  });

  app.patch("/api/services/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const existingService = await storage.getService(id);
      
      if (!existingService) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      const parseResult = insertServiceSchema.partial().safeParse(req.body);
      
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid service data", errors: parseResult.error });
      }
      
      const updatedService = await storage.updateService(id, parseResult.data);
      res.json(updatedService);
    } catch (error) {
      res.status(500).json({ message: "Error updating service" });
    }
  });

  app.delete("/api/services/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const existingService = await storage.getService(id);
      
      if (!existingService) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      await storage.deleteService(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting service" });
    }
  });

  // Staff
  app.get("/api/staff", async (req: Request, res: Response) => {
    try {
      const staff = await storage.getAllStaff();
      res.json(staff);
    } catch (error) {
      res.status(500).json({ message: "Error fetching staff" });
    }
  });

  app.get("/api/staff/active", async (req: Request, res: Response) => {
    try {
      const staff = await storage.getActiveStaff();
      res.json(staff);
    } catch (error) {
      res.status(500).json({ message: "Error fetching active staff" });
    }
  });

  app.get("/api/staff/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const staffMember = await storage.getStaff(id);
      
      if (!staffMember) {
        return res.status(404).json({ message: "Staff member not found" });
      }
      
      res.json(staffMember);
    } catch (error) {
      res.status(500).json({ message: "Error fetching staff member" });
    }
  });

  app.post("/api/staff", async (req: Request, res: Response) => {
    try {
      const parseResult = insertStaffSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid staff data", errors: parseResult.error });
      }
      
      const newStaff = await storage.createStaff(parseResult.data);
      res.status(201).json(newStaff);
    } catch (error) {
      res.status(500).json({ message: "Error creating staff member" });
    }
  });

  app.patch("/api/staff/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const existingStaff = await storage.getStaff(id);
      
      if (!existingStaff) {
        return res.status(404).json({ message: "Staff member not found" });
      }
      
      const parseResult = insertStaffSchema.partial().safeParse(req.body);
      
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid staff data", errors: parseResult.error });
      }
      
      const updatedStaff = await storage.updateStaff(id, parseResult.data);
      res.json(updatedStaff);
    } catch (error) {
      res.status(500).json({ message: "Error updating staff member" });
    }
  });

  app.delete("/api/staff/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const existingStaff = await storage.getStaff(id);
      
      if (!existingStaff) {
        return res.status(404).json({ message: "Staff member not found" });
      }
      
      await storage.deleteStaff(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting staff member" });
    }
  });

  // Bookings
  app.get("/api/bookings", async (req: Request, res: Response) => {
    try {
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Error fetching bookings" });
    }
  });

  app.get("/api/bookings/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const booking = await storage.getBooking(id);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Error fetching booking" });
    }
  });

  app.post("/api/bookings", async (req: Request, res: Response) => {
    try {
      const parseResult = insertBookingSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid booking data", errors: parseResult.error });
      }
      
      const newBooking = await storage.createBooking(parseResult.data);
      
      // Fetch service details to include in response
      const service = await storage.getService(newBooking.serviceId);
      
      res.status(201).json({
        ...newBooking,
        serviceName: service?.name || "Unknown Service"
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating booking" });
    }
  });

  app.patch("/api/bookings/:id/status", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !["pending", "confirmed", "cancelled", "completed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      
      const existingBooking = await storage.getBooking(id);
      
      if (!existingBooking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      const updatedBooking = await storage.updateBookingStatus(id, status);
      res.json(updatedBooking);
    } catch (error) {
      res.status(500).json({ message: "Error updating booking status" });
    }
  });

  app.delete("/api/bookings/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const existingBooking = await storage.getBooking(id);
      
      if (!existingBooking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      await storage.deleteBooking(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting booking" });
    }
  });

  // Settings
  // File upload endpoint
  app.post("/api/upload", upload.single('file'), (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    res.json({ filename: req.file.filename });
  });

  app.get("/api/settings", async (req: Request, res: Response) => {
    try {
      const settings = await storage.getSettings();
      
      if (!settings) {
        return res.status(404).json({ message: "Settings not found" });
      }
      
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Error fetching settings" });
    }
  });

  app.patch("/api/settings", async (req: Request, res: Response) => {
    try {
      const parseResult = insertSettingsSchema.partial().safeParse(req.body);
      
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid settings data", errors: parseResult.error });
      }
      
      const updatedSettings = await storage.updateSettings(parseResult.data);
      res.json(updatedSettings);
    } catch (error) {
      res.status(500).json({ message: "Error updating settings" });
    }
  });

  // Admin Routes
  
  // Dashboard Statistics
  app.get("/api/admin/stats", async (req: Request, res: Response) => {
    try {
      const bookings = await storage.getAllBookings();
      const staff = await storage.getAllStaff();
      
      // Get total bookings count (no date filtering)
      const totalBookings = bookings.length;
      
      // Calculate total income (only for completed bookings)
      let totalIncome = 0;
      const services = await storage.getAllServices();
      
      // Only count income from completed bookings
      bookings.forEach(booking => {
        if (booking.status === "completed") {
          const service = services.find(s => s.id === booking.serviceId);
          if (service) {
            totalIncome += service.price;
          }
        }
      });
      
      // Get active staff count
      const activeStaff = staff.filter(s => s.active).length;
      
      // Calculate client satisfaction (average rating of staff)
      const totalRating = staff.reduce((sum, s) => sum + s.rating, 0);
      const clientSatisfaction = totalRating / staff.length;
      
      res.json({
        totalBookings,
        totalIncome: totalIncome.toFixed(2),
        activeStaff,
        clientSatisfaction: clientSatisfaction.toFixed(1)
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching admin statistics" });
    }
  });

  // Pending Bookings
  app.get("/api/admin/bookings/recent", async (req: Request, res: Response) => {
    try {
      const bookings = await storage.getAllBookings();
      const services = await storage.getAllServices();
      
      // Filter for pending bookings, sort by date desc and take the most recent 5
      const pendingBookings = bookings
        .filter(booking => booking.status === "pending")
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .map(booking => {
          const service = services.find(s => s.id === booking.serviceId);
          return {
            ...booking,
            serviceName: service ? service.name : "Unknown Service"
          };
        });
      
      res.json(pendingBookings);
    } catch (error) {
      res.status(500).json({ message: "Error fetching recent bookings" });
    }
  });

  // Admin Bookings (paginated)
  app.get("/api/admin/bookings", async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const statusFilter = req.query.status as string || "all";
      const pageSize = 10;
      
      let bookings = await storage.getAllBookings();
      const services = await storage.getAllServices();
      
      // Apply status filter if not "all"
      if (statusFilter !== "all") {
        bookings = bookings.filter(booking => booking.status === statusFilter);
      }
      
      // Sort by date desc
      bookings = bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      // Calculate pagination
      const totalItems = bookings.length;
      const totalPages = Math.ceil(totalItems / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      
      // Get current page items
      const paginatedBookings = bookings.slice(startIndex, endIndex).map(booking => {
        const service = services.find(s => s.id === booking.serviceId);
        return {
          ...booking,
          serviceName: service ? service.name : "Unknown Service"
        };
      });
      
      res.json({
        bookings: paginatedBookings,
        currentPage: page,
        totalPages,
        totalItems
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching admin bookings" });
    }
  });

  // Service Statistics
  app.get("/api/admin/services/stats", async (req: Request, res: Response) => {
    try {
      const services = await storage.getAllServices();
      const bookings = await storage.getAllBookings();
      
      // Count bookings per service
      const serviceStats = services.map(service => {
        const serviceBookings = bookings.filter(b => b.serviceId === service.id);
        const count = serviceBookings.length;
        const completedCount = serviceBookings.filter(b => b.status === "completed").length;
        
        return {
          id: service.id,
          name: service.name,
          price: service.price,
          duration: service.duration,
          totalBookings: count,
          completedBookings: completedCount,
          percentage: Math.round((count / (bookings.length || 1)) * 100)
        };
      });
      
      // Sort by total bookings
      serviceStats.sort((a, b) => b.totalBookings - a.totalBookings);
      
      res.json(serviceStats);
    } catch (error) {
      res.status(500).json({ message: "Error fetching service statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
