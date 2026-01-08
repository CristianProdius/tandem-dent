/**
 * Database Seed Script for TandemDent
 *
 * This script populates the Appwrite database with sample data for development/testing.
 *
 * Usage:
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' src/scripts/seed-database.ts
 *
 * Make sure your .env.local file is configured with Appwrite credentials.
 */

import * as sdk from "node-appwrite";
import { ID, Query } from "node-appwrite";

// Load environment variables
require("dotenv").config({ path: ".env.local" });

const {
  NEXT_PUBLIC_ENDPOINT: ENDPOINT,
  PROJECT_ID,
  API_KEY,
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
  DOCTOR_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
  SERVICE_COLLECTION_ID,
  TREATMENT_COLLECTION_ID,
} = process.env;

// Validate required environment variables
if (!ENDPOINT || !PROJECT_ID || !API_KEY || !DATABASE_ID) {
  console.error("Missing required environment variables. Please check your .env.local file.");
  console.error("Required: NEXT_PUBLIC_ENDPOINT, PROJECT_ID, API_KEY, DATABASE_ID");
  process.exit(1);
}

// Initialize Appwrite client
const client = new sdk.Client();
client.setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);

const databases = new sdk.Databases(client);
const users = new sdk.Users(client);

// Sample data
const DOCTORS = [
  {
    name: "Dr. Ion Popescu",
    email: "ion.popescu@tandemdent.md",
    phone: "+373 69 123 456",
    specialty: "Stomatologie Generala",
    googleCalendarConnected: false,
  },
  {
    name: "Dr. Maria Ionescu",
    email: "maria.ionescu@tandemdent.md",
    phone: "+373 69 234 567",
    specialty: "Ortodontie",
    googleCalendarConnected: false,
  },
  {
    name: "Dr. Alexandru Rusu",
    email: "alex.rusu@tandemdent.md",
    phone: "+373 69 345 678",
    specialty: "Chirurgie Dentara",
    googleCalendarConnected: false,
  },
  {
    name: "Dr. Elena Cojocaru",
    email: "elena.cojocaru@tandemdent.md",
    phone: "+373 69 456 789",
    specialty: "Endodontie",
    googleCalendarConnected: false,
  },
];

const PATIENTS = [
  {
    name: "Ana Munteanu",
    email: "ana.munteanu@gmail.com",
    phone: "+37378111222",
    birthDate: new Date("1990-05-15"),
    gender: "female" as const,
    address: "Str. Stefan cel Mare 45, Chisinau",
    occupation: "Profesor",
    emergencyContactName: "Mihai Munteanu",
    emergencyContactNumber: "+37378333444",
    insuranceProvider: "CNAM",
    insurancePolicyNumber: "MD-2024-001234",
  },
  {
    name: "Vasile Costin",
    email: "vasile.costin@yahoo.com",
    phone: "+37379222333",
    birthDate: new Date("1985-08-22"),
    gender: "male" as const,
    address: "Bd. Decebal 78, Chisinau",
    occupation: "Inginer",
    emergencyContactName: "Ioana Costin",
    emergencyContactNumber: "+37379444555",
    insuranceProvider: "Grawe",
    insurancePolicyNumber: "GRW-2024-005678",
  },
  {
    name: "Cristina Bogdan",
    email: "cristina.bogdan@mail.ru",
    phone: "+37368333444",
    birthDate: new Date("1995-03-10"),
    gender: "female" as const,
    address: "Str. Albisoara 12, Chisinau",
    occupation: "Designer",
    emergencyContactName: "Nicolae Bogdan",
    emergencyContactNumber: "+37368555666",
    insuranceProvider: "Moldasig",
    insurancePolicyNumber: "MS-2024-009012",
  },
  {
    name: "Andrei Rotaru",
    email: "andrei.rotaru@gmail.com",
    phone: "+37369444555",
    birthDate: new Date("1978-11-28"),
    gender: "male" as const,
    address: "Str. Columna 33, Chisinau",
    occupation: "Avocat",
    emergencyContactName: "Diana Rotaru",
    emergencyContactNumber: "+37369666777",
    insuranceProvider: "CNAM",
    insurancePolicyNumber: "MD-2024-003456",
  },
  {
    name: "Natalia Ciobanu",
    email: "natalia.ciobanu@outlook.com",
    phone: "+37378555666",
    birthDate: new Date("1992-07-04"),
    gender: "female" as const,
    address: "Str. Bucuresti 89, Chisinau",
    occupation: "Medic",
    emergencyContactName: "Sergiu Ciobanu",
    emergencyContactNumber: "+37378777888",
    insuranceProvider: "Grawe",
    insurancePolicyNumber: "GRW-2024-007890",
  },
  {
    name: "Dumitru Lungu",
    email: "dumitru.lungu@gmail.com",
    phone: "+37379666777",
    birthDate: new Date("1982-01-19"),
    gender: "male" as const,
    address: "Str. Ismail 56, Chisinau",
    occupation: "Antreprenor",
    emergencyContactName: "Maria Lungu",
    emergencyContactNumber: "+37379888999",
    insuranceProvider: "Moldasig",
    insurancePolicyNumber: "MS-2024-001234",
  },
  {
    name: "Irina Moraru",
    email: "irina.moraru@yahoo.com",
    phone: "+37368777888",
    birthDate: new Date("1998-09-30"),
    gender: "female" as const,
    address: "Str. Puskin 23, Chisinau",
    occupation: "Student",
    emergencyContactName: "Gheorghe Moraru",
    emergencyContactNumber: "+37368999000",
    insuranceProvider: "CNAM",
    insurancePolicyNumber: "MD-2024-005678",
  },
  {
    name: "Mihail Palade",
    email: "mihail.palade@mail.ru",
    phone: "+37369888999",
    birthDate: new Date("1970-04-12"),
    gender: "male" as const,
    address: "Str. Vasile Alecsandri 67, Chisinau",
    occupation: "Pensionar",
    emergencyContactName: "Valentina Palade",
    emergencyContactNumber: "+37369000111",
    insuranceProvider: "CNAM",
    insurancePolicyNumber: "MD-2024-009012",
  },
];

const SERVICES = [
  { name: "Consultatie", description: "Consultatie stomatologica generala", duration: 30, price: 200, isActive: true, category: "medical" as const },
  { name: "Detartraj", description: "Curatare profesionala a dintilor", duration: 45, price: 400, isActive: true, category: "medical" as const },
  { name: "Obturatoie Compozit", description: "Plomba din material compozit", duration: 60, price: 600, isActive: true, category: "medical" as const },
  { name: "Extractie Dinte", description: "Extractie dinte simpla", duration: 30, price: 350, isActive: true, category: "medical" as const },
  { name: "Tratament de Canal", description: "Tratament endodontic complet", duration: 90, price: 1500, isActive: true, category: "medical" as const },
  { name: "Coroana Ceramica", description: "Coroana dentara din ceramica", duration: 60, price: 3500, isActive: true, category: "medical" as const },
  { name: "Albire Dentara", description: "Albire profesionala in cabinet", duration: 60, price: 2000, isActive: true, category: "cosmetic" as const },
  { name: "Implant Dentar", description: "Implant dentar cu titanium", duration: 120, price: 8000, isActive: true, category: "medical" as const },
  { name: "Aparate Ortodontice", description: "Montare aparat ortodontic", duration: 90, price: 15000, isActive: true, category: "medical" as const },
  { name: "Radiografie Dentara", description: "Radiografie panoramica", duration: 15, price: 150, isActive: true, category: "medical" as const },
];

// Helper to get a random item from an array
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper to get a random date in the past/future
function randomDate(daysRange: number, future = false): Date {
  const date = new Date();
  const days = Math.floor(Math.random() * daysRange);
  if (future) {
    date.setDate(date.getDate() + days);
  } else {
    date.setDate(date.getDate() - days);
  }
  // Set random hour between 9 and 17
  date.setHours(9 + Math.floor(Math.random() * 8), Math.random() > 0.5 ? 0 : 30, 0, 0);
  return date;
}

async function createUser(data: { name: string; email: string; phone: string }) {
  try {
    const newUser = await users.create(ID.unique(), data.email, data.phone, undefined, data.name);
    return newUser;
  } catch (error: any) {
    if (error?.code === 409) {
      // User already exists, find them
      const byEmail = await users.list([Query.equal("email", [data.email])]);
      if (byEmail.users[0]) {
        return byEmail.users[0];
      }
    }
    throw error;
  }
}

async function seedDoctors() {
  console.log("\n--- Seeding Doctors ---");
  const createdDoctors: any[] = [];

  for (const doctor of DOCTORS) {
    try {
      const doc = await databases.createDocument(
        DATABASE_ID!,
        DOCTOR_COLLECTION_ID!,
        ID.unique(),
        doctor
      );
      console.log(`  Created doctor: ${doctor.name}`);
      createdDoctors.push(doc);
    } catch (error: any) {
      console.error(`  Error creating doctor ${doctor.name}:`, error?.message);
    }
  }

  return createdDoctors;
}

async function seedServices() {
  console.log("\n--- Seeding Services ---");
  const createdServices: any[] = [];

  for (const service of SERVICES) {
    try {
      const srv = await databases.createDocument(
        DATABASE_ID!,
        SERVICE_COLLECTION_ID!,
        ID.unique(),
        service
      );
      console.log(`  Created service: ${service.name}`);
      createdServices.push(srv);
    } catch (error: any) {
      console.error(`  Error creating service ${service.name}:`, error?.message);
    }
  }

  return createdServices;
}

async function seedPatients(doctors: any[]) {
  console.log("\n--- Seeding Patients ---");
  const createdPatients: any[] = [];

  for (const patient of PATIENTS) {
    try {
      // Create user first
      const user = await createUser({
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
      });

      // Create patient document
      const patientDoc = await databases.createDocument(
        DATABASE_ID!,
        PATIENT_COLLECTION_ID!,
        ID.unique(),
        {
          userId: user.$id,
          ...patient,
          primaryPhysician: randomItem(doctors)?.name || "Dr. Ion Popescu",
          privacyConsent: true,
        }
      );
      console.log(`  Created patient: ${patient.name}`);
      createdPatients.push(patientDoc);
    } catch (error: any) {
      console.error(`  Error creating patient ${patient.name}:`, error?.message);
    }
  }

  return createdPatients;
}

async function seedAppointments(patients: any[], doctors: any[], services: any[]) {
  console.log("\n--- Seeding Appointments ---");
  const createdAppointments: any[] = [];
  const statuses = ["scheduled", "pending", "cancelled"];

  // Create appointments for each patient
  for (const patient of patients) {
    // Each patient gets 1-3 appointments
    const numAppointments = 1 + Math.floor(Math.random() * 3);

    for (let i = 0; i < numAppointments; i++) {
      const doctor = randomItem(doctors);
      const service = randomItem(services);
      const isPast = Math.random() > 0.5;
      const status = isPast ? "scheduled" : randomItem(statuses);

      try {
        const appointment = await databases.createDocument(
          DATABASE_ID!,
          APPOINTMENT_COLLECTION_ID!,
          ID.unique(),
          {
            patient: patient.$id,
            schedule: randomDate(30, !isPast).toISOString(),
            status,
            primaryPhysician: doctor?.name || "Dr. Ion Popescu",
            reason: service?.name || "Consultatie",
            note: `Programare pentru ${patient.name}`,
            userId: patient.userId,
            cancellationReason: status === "cancelled" ? "Reprogramat la cererea pacientului" : null,
            doctorId: doctor?.$id,
          }
        );
        console.log(`  Created appointment for ${patient.name}: ${service?.name || "Consultatie"}`);
        createdAppointments.push(appointment);
      } catch (error: any) {
        console.error(`  Error creating appointment for ${patient.name}:`, error?.message);
      }
    }
  }

  return createdAppointments;
}

async function seedTreatments(patients: any[], doctors: any[]) {
  console.log("\n--- Seeding Treatments ---");
  const conditions = ["healthy", "caries", "decay", "filled", "crown", "root_canal"];
  const treatments = ["examination", "cleaning", "tooth_filling", "root_canal", "crown", "extraction"];
  const treatmentStatuses = ["pending", "in_progress", "done"];
  const toothNumbers = [11, 12, 13, 14, 15, 16, 21, 22, 23, 24, 25, 26, 31, 32, 33, 34, 35, 36, 41, 42, 43, 44, 45, 46];

  // Create treatments for each patient
  for (const patient of patients) {
    // Each patient gets 1-4 treatments
    const numTreatments = 1 + Math.floor(Math.random() * 4);
    const usedTeeth = new Set<number>();

    for (let i = 0; i < numTreatments; i++) {
      const doctor = randomItem(doctors);

      // Get a unique tooth number for this patient
      let toothNumber: number;
      do {
        toothNumber = randomItem(toothNumbers);
      } while (usedTeeth.has(toothNumber));
      usedTeeth.add(toothNumber);

      try {
        await databases.createDocument(
          DATABASE_ID!,
          TREATMENT_COLLECTION_ID!,
          ID.unique(),
          {
            patientId: patient.$id,
            toothNumber,
            condition: randomItem(conditions),
            treatment: randomItem(treatments),
            status: randomItem(treatmentStatuses),
            doctorId: doctor?.$id || "",
            doctorName: doctor?.name || "Dr. Ion Popescu",
            notes: "Tratament standard",
            date: randomDate(60, false).toISOString(),
          }
        );
        console.log(`  Created treatment for ${patient.name}: Tooth #${toothNumber}`);
      } catch (error: any) {
        console.error(`  Error creating treatment for ${patient.name}:`, error?.message);
      }
    }
  }
}

async function main() {
  console.log("===========================================");
  console.log("TandemDent Database Seed Script");
  console.log("===========================================");
  console.log(`Endpoint: ${ENDPOINT}`);
  console.log(`Project ID: ${PROJECT_ID}`);
  console.log(`Database ID: ${DATABASE_ID}`);

  try {
    // Seed in order due to dependencies
    const doctors = await seedDoctors();
    const services = await seedServices();
    const patients = await seedPatients(doctors);
    await seedAppointments(patients, doctors, services);
    await seedTreatments(patients, doctors);

    console.log("\n===========================================");
    console.log("Seeding complete!");
    console.log(`  Doctors: ${doctors.length}`);
    console.log(`  Services: ${services.length}`);
    console.log(`  Patients: ${patients.length}`);
    console.log("===========================================");
  } catch (error) {
    console.error("\nFatal error during seeding:", error);
    process.exit(1);
  }
}

main();
