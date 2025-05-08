import { db } from "../server/db";
import { 
  users, 
  services, 
  staff, 
  settings, 
} from "../shared/schema";

// Seed admin user
async function seedUsers() {
  const existingUsers = await db.select().from(users);
  if (existingUsers.length === 0) {
    console.log("Seeding admin user...");
    await db.insert(users).values({
      username: "admin",
      password: "password" // In a real app, this would be hashed
    });
  } else {
    console.log("Users already exist, skipping seed");
  }
}

// Seed services
async function seedServices() {
  const existingServices = await db.select().from(services);
  if (existingServices.length === 0) {
    console.log("Seeding services...");
    await db.insert(services).values([
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
    ]);
  } else {
    console.log("Services already exist, skipping seed");
  }
}

// Seed staff
async function seedStaff() {
  const existingStaff = await db.select().from(staff);
  if (existingStaff.length === 0) {
    console.log("Seeding staff...");
    await db.insert(staff).values([
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
    ]);
  } else {
    console.log("Staff already exist, skipping seed");
  }
}

// Seed settings
async function seedSettings() {
  const existingSettings = await db.select().from(settings);
  if (existingSettings.length === 0) {
    console.log("Seeding settings...");
    await db.insert(settings).values({
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
  } else {
    console.log("Settings already exist, skipping seed");
  }
}

// Main seed function
async function seed() {
  try {
    console.log("Starting database seeding...");
    
    await seedUsers();
    await seedServices();
    await seedStaff();
    await seedSettings();
    
    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seed function
seed();