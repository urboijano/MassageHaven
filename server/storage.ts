import { 
  users, type User, type InsertUser,
  services, type Service, type InsertService,
  staff, type Staff, type InsertStaff,
  bookings, type Booking, type InsertBooking,
  settings, type Settings, type InsertSettings
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Service methods
  getAllServices(): Promise<Service[]>;
  getFeaturedServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;

  // Staff methods
  getAllStaff(): Promise<Staff[]>;
  getActiveStaff(): Promise<Staff[]>;
  getStaff(id: number): Promise<Staff | undefined>;
  createStaff(staff: InsertStaff): Promise<Staff>;
  updateStaff(id: number, staffData: Partial<InsertStaff>): Promise<Staff | undefined>;
  deleteStaff(id: number): Promise<boolean>;

  // Booking methods
  getAllBookings(): Promise<Booking[]>;
  getBooking(id: number): Promise<Booking | undefined>;
  getBookingsByDate(date: string): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;
  deleteBooking(id: number): Promise<boolean>;

  // Settings methods
  getSettings(): Promise<Settings | undefined>;
  updateSettings(settings: Partial<InsertSettings>): Promise<Settings>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private services: Map<number, Service>;
  private staffMembers: Map<number, Staff>;
  private bookings: Map<number, Booking>;
  private settingsData: Settings | undefined;
  
  private userCounter: number;
  private serviceCounter: number;
  private staffCounter: number;
  private bookingCounter: number;

  constructor() {
    this.users = new Map();
    this.services = new Map();
    this.staffMembers = new Map();
    this.bookings = new Map();
    
    this.userCounter = 1;
    this.serviceCounter = 1;
    this.staffCounter = 1;
    this.bookingCounter = 1;

    // Initialize with sample admin user
    this.createUser({
      username: "admin",
      password: "password" // In a real app, this would be hashed
    });

    // Initialize with sample services
    this.initializeServices();
    
    // Initialize with sample staff
    this.initializeStaff();

    // Initialize settings
    this.initializeSettings();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Service methods
  async getAllServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async getFeaturedServices(): Promise<Service[]> {
    return Array.from(this.services.values()).filter(
      (service) => service.featured
    );
  }

  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = this.serviceCounter++;
    const now = new Date();
    const service: Service = { 
      ...insertService, 
      id,
      createdAt: now
    };
    this.services.set(id, service);
    return service;
  }

  async updateService(id: number, serviceData: Partial<InsertService>): Promise<Service | undefined> {
    const service = this.services.get(id);
    if (!service) return undefined;

    const updatedService = { ...service, ...serviceData };
    this.services.set(id, updatedService);
    return updatedService;
  }

  async deleteService(id: number): Promise<boolean> {
    return this.services.delete(id);
  }

  // Staff methods
  async getAllStaff(): Promise<Staff[]> {
    return Array.from(this.staffMembers.values());
  }

  async getActiveStaff(): Promise<Staff[]> {
    return Array.from(this.staffMembers.values()).filter(
      (staff) => staff.active
    );
  }

  async getStaff(id: number): Promise<Staff | undefined> {
    return this.staffMembers.get(id);
  }

  async createStaff(insertStaff: InsertStaff): Promise<Staff> {
    const id = this.staffCounter++;
    const now = new Date();
    const staff: Staff = { 
      ...insertStaff, 
      id,
      createdAt: now
    };
    this.staffMembers.set(id, staff);
    return staff;
  }

  async updateStaff(id: number, staffData: Partial<InsertStaff>): Promise<Staff | undefined> {
    const staff = this.staffMembers.get(id);
    if (!staff) return undefined;

    const updatedStaff = { ...staff, ...staffData };
    this.staffMembers.set(id, updatedStaff);
    return updatedStaff;
  }

  async deleteStaff(id: number): Promise<boolean> {
    return this.staffMembers.delete(id);
  }

  // Booking methods
  async getAllBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getBookingsByDate(date: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.date === date
    );
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.bookingCounter++;
    const now = new Date();
    const booking: Booking = { 
      ...insertBooking, 
      id,
      createdAt: now
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;

    const updatedBooking = { ...booking, status };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  async deleteBooking(id: number): Promise<boolean> {
    return this.bookings.delete(id);
  }

  // Settings methods
  async getSettings(): Promise<Settings | undefined> {
    return this.settingsData;
  }

  async updateSettings(settingsData: Partial<InsertSettings>): Promise<Settings> {
    if (!this.settingsData) {
      this.settingsData = {
        id: 1,
        businessName: "Massage Haven",
        contactEmail: "info@massagehaven.com",
        phone: "(555) 123-4567",
        address: "123 Serenity Lane, Wellness District",
        description: "Your sanctuary for wellness and rejuvenation in the heart of the city.",
        mondayToFridayOpen: "09:00",
        mondayToFridayClose: "20:00",
        saturdayOpen: "09:00",
        saturdayClose: "18:00",
        sundayOpen: "10:00",
        sundayClose: "17:00",
        mondayToFridayEnabled: true,
        saturdayEnabled: true,
        sundayEnabled: true,
        ...settingsData
      };
    } else {
      this.settingsData = { ...this.settingsData, ...settingsData };
    }
    
    return this.settingsData;
  }

  // Helper methods to initialize data
  private initializeServices() {
    const defaultServices: InsertService[] = [
      {
        name: "Deep Tissue Massage",
        description: "A therapeutic massage focusing on realigning deeper layers of muscles and connective tissue.",
        price: 120,
        duration: 60,
        imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        featured: true
      },
      {
        name: "Hot Stone Therapy",
        description: "Smooth, heated stones are placed on specific points of the body to release tension and stress.",
        price: 150,
        duration: 90,
        imageUrl: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        featured: true
      },
      {
        name: "Luxury Facial",
        description: "A rejuvenating facial treatment using premium organic products to hydrate and revitalize your skin.",
        price: 135,
        duration: 75,
        imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        featured: true
      },
      {
        name: "Swedish Massage",
        description: "A gentle, relaxing massage that improves circulation and relieves muscle tension.",
        price: 100,
        duration: 60,
        imageUrl: "https://images.unsplash.com/photo-1519824145371-296894a0daa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        featured: false
      },
      {
        name: "Aromatherapy Massage",
        description: "A therapeutic massage using essential oils to promote relaxation and well-being.",
        price: 130,
        duration: 75,
        imageUrl: "https://images.unsplash.com/photo-1537211560895-1e9a1aaa7d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        featured: false
      },
      {
        name: "Couples Massage",
        description: "Share a relaxing massage experience with a partner or friend in our dedicated couples suite.",
        price: 220,
        duration: 60,
        imageUrl: "https://images.unsplash.com/photo-1591343395082-e120087004b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        featured: false
      }
    ];

    defaultServices.forEach(service => {
      this.createService(service);
    });
  }

  private initializeStaff() {
    const defaultStaff: InsertStaff[] = [
      {
        name: "Jennifer Davis",
        role: "Senior Massage Therapist",
        bio: "Specializes in deep tissue and sports massage with over 8 years of experience.",
        imageUrl: "",
        initials: "JD",
        sessions: 342,
        rating: 4.9,
        active: true
      },
      {
        name: "Robert Martinez",
        role: "Lead Facial Specialist",
        bio: "Expert in luxury facials and skincare treatments with certifications in advanced techniques.",
        imageUrl: "",
        initials: "RM",
        sessions: 287,
        rating: 4.8,
        active: true
      },
      {
        name: "Andrea Patel",
        role: "Aromatherapy Specialist",
        bio: "Specialized in holistic treatments and aromatherapy with knowledge of essential oils.",
        imageUrl: "",
        initials: "AP",
        sessions: 263,
        rating: 4.7,
        active: true
      }
    ];

    defaultStaff.forEach(staffMember => {
      this.createStaff(staffMember);
    });
  }

  private initializeSettings() {
    this.updateSettings({
      businessName: "Massage Haven",
      contactEmail: "info@massagehaven.com",
      phone: "(555) 123-4567",
      address: "123 Serenity Lane, Wellness District",
      description: "Your sanctuary for wellness and rejuvenation in the heart of the city.",
      mondayToFridayOpen: "09:00",
      mondayToFridayClose: "20:00",
      saturdayOpen: "09:00",
      saturdayClose: "18:00",
      sundayOpen: "10:00",
      sundayClose: "17:00",
      mondayToFridayEnabled: true,
      saturdayEnabled: true,
      sundayEnabled: true
    });
  }
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Service methods
  async getAllServices(): Promise<Service[]> {
    return db.select().from(services);
  }

  async getFeaturedServices(): Promise<Service[]> {
    return db.select().from(services).where(eq(services.featured, true));
  }

  async getService(id: number): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }

  async createService(service: InsertService): Promise<Service> {
    const [createdService] = await db
      .insert(services)
      .values(service)
      .returning();
    return createdService;
  }

  async updateService(id: number, serviceData: Partial<InsertService>): Promise<Service | undefined> {
    const [updatedService] = await db
      .update(services)
      .set(serviceData)
      .where(eq(services.id, id))
      .returning();
    return updatedService;
  }

  async deleteService(id: number): Promise<boolean> {
    const [deleted] = await db
      .delete(services)
      .where(eq(services.id, id))
      .returning();
    return !!deleted;
  }

  // Staff methods
  async getAllStaff(): Promise<Staff[]> {
    return db.select().from(staff);
  }

  async getActiveStaff(): Promise<Staff[]> {
    return db.select().from(staff).where(eq(staff.active, true));
  }

  async getStaff(id: number): Promise<Staff | undefined> {
    const [staffMember] = await db.select().from(staff).where(eq(staff.id, id));
    return staffMember;
  }

  async createStaff(staffData: InsertStaff): Promise<Staff> {
    const [createdStaff] = await db
      .insert(staff)
      .values(staffData)
      .returning();
    return createdStaff;
  }

  async updateStaff(id: number, staffData: Partial<InsertStaff>): Promise<Staff | undefined> {
    const [updatedStaff] = await db
      .update(staff)
      .set(staffData)
      .where(eq(staff.id, id))
      .returning();
    return updatedStaff;
  }

  async deleteStaff(id: number): Promise<boolean> {
    const [deleted] = await db
      .delete(staff)
      .where(eq(staff.id, id))
      .returning();
    return !!deleted;
  }

  // Booking methods
  async getAllBookings(): Promise<Booking[]> {
    return db.select().from(bookings);
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  async getBookingsByDate(date: string): Promise<Booking[]> {
    return db.select().from(bookings).where(eq(bookings.date, date));
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [createdBooking] = await db
      .insert(bookings)
      .values(booking)
      .returning();
    return createdBooking;
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const [updatedBooking] = await db
      .update(bookings)
      .set({ status })
      .where(eq(bookings.id, id))
      .returning();
    return updatedBooking;
  }

  async deleteBooking(id: number): Promise<boolean> {
    const [deleted] = await db
      .delete(bookings)
      .where(eq(bookings.id, id))
      .returning();
    return !!deleted;
  }

  // Settings methods
  async getSettings(): Promise<Settings | undefined> {
    const [setting] = await db.select().from(settings);
    return setting;
  }

  async updateSettings(settingsData: Partial<InsertSettings>): Promise<Settings> {
    // First check if settings exist
    const existingSettings = await this.getSettings();
    
    if (existingSettings) {
      // Update existing settings
      const [updatedSettings] = await db
        .update(settings)
        .set(settingsData)
        .where(eq(settings.id, existingSettings.id))
        .returning();
      return updatedSettings;
    } else {
      // Create new settings
      const [newSettings] = await db
        .insert(settings)
        .values(settingsData)
        .returning();
      return newSettings;
    }
  }
}

// Choose between memory storage and database storage based on environment
export const storage = process.env.DATABASE_URL 
  ? new DatabaseStorage() 
  : new MemStorage();
