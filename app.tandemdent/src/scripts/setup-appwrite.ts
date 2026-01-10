/**
 * Appwrite Setup Script for TandemDent
 *
 * This script creates the database and all collections with proper attributes.
 * Run this ONCE after creating a new Appwrite project.
 *
 * Usage:
 *   1. Create a new project in Appwrite console
 *   2. Create an API key with all permissions
 *   3. Update .env.local with PROJECT_ID, NEXT_PUBLIC_ENDPOINT, and API_KEY
 *   4. Run: npm run setup:appwrite
 *
 * The script will output the collection IDs to add to your .env.local
 */

import * as sdk from "node-appwrite";
import { ID, Permission, Role } from "node-appwrite";

// Load environment variables
require("dotenv").config({ path: ".env.local" });

const {
  NEXT_PUBLIC_ENDPOINT: ENDPOINT,
  PROJECT_ID,
  API_KEY,
} = process.env;

if (!ENDPOINT || !PROJECT_ID || !API_KEY) {
  console.error("Missing required environment variables.");
  console.error("Please set: NEXT_PUBLIC_ENDPOINT, PROJECT_ID, API_KEY in .env.local");
  process.exit(1);
}

// Initialize Appwrite client
const client = new sdk.Client();
client.setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);

const databases = new sdk.Databases(client);
const storage = new sdk.Storage(client);

const DATABASE_NAME = "tandemdent";

// Type definitions for attributes
type StringAttribute = {
  type: "string";
  key: string;
  size: number;
  required: boolean;
};

type IntegerAttribute = {
  type: "integer";
  key: string;
  required: boolean;
  min?: number;
  max?: number;
};

type FloatAttribute = {
  type: "float";
  key: string;
  required: boolean;
  min?: number;
  max?: number;
};

type BooleanAttribute = {
  type: "boolean";
  key: string;
  required: boolean;
};

type DatetimeAttribute = {
  type: "datetime";
  key: string;
  required: boolean;
};

type EnumAttribute = {
  type: "enum";
  key: string;
  elements: string[];
  required: boolean;
};

type Attribute = StringAttribute | IntegerAttribute | FloatAttribute | BooleanAttribute | DatetimeAttribute | EnumAttribute;

type IndexConfig = {
  key: string;
  type: "key" | "unique" | "fulltext";
  attributes: string[];
};

type CollectionConfig = {
  name: string;
  attributes: Attribute[];
  indexes: IndexConfig[];
};

// Collection schemas
const COLLECTIONS: Record<string, CollectionConfig> = {
  admin: {
    name: "admin",
    attributes: [
      { type: "string", key: "name", size: 200, required: true },
      { type: "string", key: "email", size: 200, required: true },
      { type: "string", key: "avatar", size: 1000, required: false },
      { type: "string", key: "phone", size: 50, required: false },
      { type: "string", key: "appwriteAuthId", size: 255, required: false },
    ],
    indexes: [
      { key: "email_idx", type: "unique", attributes: ["email"] },
      { key: "appwriteAuthId_idx", type: "key", attributes: ["appwriteAuthId"] },
    ],
  },
  patient: {
    name: "patient",
    attributes: [
      { type: "string", key: "userId", size: 255, required: true },
      { type: "string", key: "name", size: 255, required: true },
      { type: "string", key: "email", size: 255, required: true },
      { type: "string", key: "phone", size: 50, required: true },
      { type: "datetime", key: "birthDate", required: false },
      { type: "enum", key: "gender", elements: ["male", "female", "other"], required: false },
      { type: "string", key: "address", size: 500, required: false },
      { type: "string", key: "occupation", size: 255, required: false },
      { type: "string", key: "emergencyContactName", size: 255, required: false },
      { type: "string", key: "emergencyContactNumber", size: 50, required: false },
      { type: "string", key: "insuranceProvider", size: 255, required: false },
      { type: "string", key: "insurancePolicyNumber", size: 255, required: false },
      { type: "string", key: "primaryPhysician", size: 255, required: false },
      { type: "string", key: "allergies", size: 1000, required: false },
      { type: "string", key: "currentMedication", size: 1000, required: false },
      { type: "string", key: "familyMedicalHistory", size: 1000, required: false },
      { type: "string", key: "pastMedicalHistory", size: 1000, required: false },
      { type: "string", key: "identificationType", size: 100, required: false },
      { type: "string", key: "identificationNumber", size: 100, required: false },
      { type: "string", key: "identificationDocumentId", size: 255, required: false },
      { type: "string", key: "identificationDocumentUrl", size: 1000, required: false },
      { type: "boolean", key: "privacyConsent", required: false },
      { type: "boolean", key: "treatmentConsent", required: false },
      { type: "boolean", key: "disclosureConsent", required: false },
    ],
    indexes: [
      { key: "userId_idx", type: "key", attributes: ["userId"] },
      { key: "email_idx", type: "key", attributes: ["email"] },
      { key: "name_idx", type: "fulltext", attributes: ["name"] },
    ],
  },
  doctor: {
    name: "doctor",
    attributes: [
      { type: "string", key: "name", size: 255, required: true },
      { type: "string", key: "email", size: 255, required: true },
      { type: "string", key: "phone", size: 50, required: false },
      { type: "string", key: "specialty", size: 255, required: false },
      { type: "string", key: "googleAccessToken", size: 2000, required: false },
      { type: "string", key: "googleRefreshToken", size: 2000, required: false },
      { type: "datetime", key: "googleTokenExpiry", required: false },
      { type: "boolean", key: "googleCalendarConnected", required: false },
      { type: "string", key: "avatar", size: 1000, required: false },
      // Authentication fields for doctor login
      { type: "string", key: "appwriteAuthId", size: 255, required: false },
      { type: "string", key: "magicLinkToken", size: 255, required: false },
      { type: "datetime", key: "magicLinkExpiresAt", required: false },
      { type: "string", key: "sessionToken", size: 255, required: false },
      { type: "datetime", key: "sessionExpiresAt", required: false },
    ],
    indexes: [
      { key: "email_idx", type: "unique", attributes: ["email"] },
      { key: "name_idx", type: "fulltext", attributes: ["name"] },
      { key: "sessionToken_idx", type: "key", attributes: ["sessionToken"] },
    ],
  },
  appointment: {
    name: "appointment",
    attributes: [
      { type: "string", key: "patient", size: 255, required: true },
      { type: "string", key: "userId", size: 255, required: true },
      { type: "datetime", key: "schedule", required: true },
      { type: "enum", key: "status", elements: ["pending", "scheduled", "cancelled"], required: true },
      { type: "string", key: "primaryPhysician", size: 255, required: true },
      { type: "string", key: "reason", size: 1000, required: false },
      { type: "string", key: "note", size: 2000, required: false },
      { type: "string", key: "cancellationReason", size: 1000, required: false },
      { type: "string", key: "doctorId", size: 255, required: false },
      { type: "string", key: "googleEventId", size: 255, required: false },
    ],
    indexes: [
      { key: "patient_idx", type: "key", attributes: ["patient"] },
      { key: "userId_idx", type: "key", attributes: ["userId"] },
      { key: "status_idx", type: "key", attributes: ["status"] },
      { key: "schedule_idx", type: "key", attributes: ["schedule"] },
      { key: "doctorId_idx", type: "key", attributes: ["doctorId"] },
    ],
  },
  service: {
    name: "service",
    attributes: [
      { type: "string", key: "name", size: 255, required: true },
      { type: "string", key: "description", size: 1000, required: false },
      { type: "integer", key: "duration", required: false, min: 0, max: 480 },
      { type: "float", key: "price", required: false, min: 0, max: 1000000 },
      { type: "boolean", key: "isActive", required: false },
      { type: "enum", key: "category", elements: ["medical", "cosmetic", "preventive", "emergency"], required: false },
    ],
    indexes: [
      { key: "name_idx", type: "fulltext", attributes: ["name"] },
      { key: "category_idx", type: "key", attributes: ["category"] },
    ],
  },
  treatment: {
    name: "treatment",
    attributes: [
      { type: "string", key: "patientId", size: 255, required: true },
      { type: "integer", key: "toothNumber", required: true, min: 11, max: 85 },
      { type: "enum", key: "condition", elements: ["healthy", "caries", "decay", "filled", "crown", "root_canal", "missing", "implant", "bridge"], required: false },
      { type: "enum", key: "treatment", elements: ["examination", "cleaning", "tooth_filling", "root_canal", "crown", "extraction", "implant", "bridge", "whitening", "orthodontics"], required: false },
      { type: "enum", key: "status", elements: ["pending", "in_progress", "done"], required: false },
      { type: "string", key: "doctorId", size: 255, required: false },
      { type: "string", key: "doctorName", size: 255, required: false },
      { type: "string", key: "notes", size: 2000, required: false },
      { type: "datetime", key: "date", required: false },
    ],
    indexes: [
      { key: "patientId_idx", type: "key", attributes: ["patientId"] },
      { key: "toothNumber_idx", type: "key", attributes: ["toothNumber"] },
      { key: "status_idx", type: "key", attributes: ["status"] },
    ],
  },
};

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createDatabase() {
  console.log("\n--- Creating Database ---");
  try {
    const db = await databases.create(ID.unique(), DATABASE_NAME);
    console.log(`  Created database: ${db.name} (${db.$id})`);
    return db.$id;
  } catch (error: any) {
    if (error?.code === 409) {
      console.log("  Database already exists, fetching...");
      const dbs = await databases.list();
      const existing = dbs.databases.find((d) => d.name === DATABASE_NAME);
      if (existing) {
        console.log(`  Using existing database: ${existing.name} (${existing.$id})`);
        return existing.$id;
      }
    }
    throw error;
  }
}

async function createCollection(databaseId: string, collectionKey: string, config: CollectionConfig) {
  console.log(`\n--- Creating Collection: ${config.name} ---`);

  try {
    const collection = await databases.createCollection(
      databaseId,
      ID.unique(),
      config.name,
      [
        Permission.read(Role.any()),
        Permission.create(Role.any()),
        Permission.update(Role.any()),
        Permission.delete(Role.any()),
      ]
    );
    console.log(`  Created collection: ${collection.name} (${collection.$id})`);

    // Create attributes
    for (const attr of config.attributes) {
      try {
        console.log(`    Creating attribute: ${attr.key} (${attr.type})`);

        switch (attr.type) {
          case "string":
            await databases.createStringAttribute(
              databaseId,
              collection.$id,
              attr.key,
              attr.size,
              attr.required
            );
            break;
          case "integer":
            await databases.createIntegerAttribute(
              databaseId,
              collection.$id,
              attr.key,
              attr.required,
              attr.min,
              attr.max
            );
            break;
          case "float":
            await databases.createFloatAttribute(
              databaseId,
              collection.$id,
              attr.key,
              attr.required,
              attr.min,
              attr.max
            );
            break;
          case "boolean":
            await databases.createBooleanAttribute(
              databaseId,
              collection.$id,
              attr.key,
              attr.required
            );
            break;
          case "datetime":
            await databases.createDatetimeAttribute(
              databaseId,
              collection.$id,
              attr.key,
              attr.required
            );
            break;
          case "enum":
            await databases.createEnumAttribute(
              databaseId,
              collection.$id,
              attr.key,
              attr.elements,
              attr.required
            );
            break;
        }
        // Small delay to avoid rate limiting
        await sleep(100);
      } catch (attrError: any) {
        if (attrError?.code === 409) {
          console.log(`      Attribute ${attr.key} already exists`);
        } else {
          console.error(`      Error creating attribute ${attr.key}:`, attrError?.message);
        }
      }
    }

    // Wait for attributes to be ready before creating indexes
    console.log("    Waiting for attributes to be ready...");
    await sleep(3000);

    // Create indexes
    if (config.indexes) {
      for (const idx of config.indexes) {
        try {
          console.log(`    Creating index: ${idx.key}`);
          await databases.createIndex(
            databaseId,
            collection.$id,
            idx.key,
            idx.type as any,
            idx.attributes
          );
          await sleep(100);
        } catch (idxError: any) {
          if (idxError?.code === 409) {
            console.log(`      Index ${idx.key} already exists`);
          } else {
            console.error(`      Error creating index ${idx.key}:`, idxError?.message);
          }
        }
      }
    }

    return collection.$id;
  } catch (error: any) {
    if (error?.code === 409) {
      console.log(`  Collection ${config.name} already exists`);
      const collections = await databases.listCollections(databaseId);
      const existing = collections.collections.find((c) => c.name === config.name);
      return existing?.$id;
    }
    throw error;
  }
}

async function createStorageBucket() {
  console.log("\n--- Creating Storage Bucket ---");
  try {
    const bucket = await storage.createBucket(
      ID.unique(),
      "patient-documents",
      [
        Permission.read(Role.any()),
        Permission.create(Role.any()),
        Permission.update(Role.any()),
        Permission.delete(Role.any()),
      ],
      false, // fileSecurity
      true, // enabled
      30000000, // 30MB max file size (self-hosted limit)
      ["image/jpeg", "image/png", "image/gif", "application/pdf"] // allowed file extensions
    );
    console.log(`  Created bucket: ${bucket.name} (${bucket.$id})`);
    return bucket.$id;
  } catch (error: any) {
    if (error?.code === 409) {
      console.log("  Bucket already exists, fetching...");
      const buckets = await storage.listBuckets();
      const existing = buckets.buckets.find((b) => b.name === "patient-documents");
      if (existing) {
        console.log(`  Using existing bucket: ${existing.name} (${existing.$id})`);
        return existing.$id;
      }
    }
    throw error;
  }
}

async function main() {
  console.log("===========================================");
  console.log("TandemDent Appwrite Setup Script");
  console.log("===========================================");
  console.log(`Endpoint: ${ENDPOINT}`);
  console.log(`Project ID: ${PROJECT_ID}`);

  try {
    // Create database
    const databaseId = await createDatabase();

    // Create collections
    const collectionIds: Record<string, string> = {};
    for (const [key, config] of Object.entries(COLLECTIONS)) {
      const collectionId = await createCollection(databaseId, key, config);
      if (collectionId) {
        collectionIds[key] = collectionId;
      }
    }

    // Create storage bucket
    const bucketId = await createStorageBucket();

    // Output environment variables
    console.log("\n===========================================");
    console.log("Setup Complete!");
    console.log("===========================================");
    console.log("\nAdd these to your .env.local file:\n");
    console.log(`DATABASE_ID=${databaseId}`);
    console.log(`ADMIN_COLLECTION_ID=${collectionIds.admin}`);
    console.log(`PATIENT_COLLECTION_ID=${collectionIds.patient}`);
    console.log(`DOCTOR_COLLECTION_ID=${collectionIds.doctor}`);
    console.log(`APPOINTMENT_COLLECTION_ID=${collectionIds.appointment}`);
    console.log(`SERVICE_COLLECTION_ID=${collectionIds.service}`);
    console.log(`TREATMENT_COLLECTION_ID=${collectionIds.treatment}`);
    console.log(`NEXT_PUBLIC_BUCKET_ID=${bucketId}`);
    console.log("\n===========================================");
  } catch (error) {
    console.error("\nFatal error during setup:", error);
    process.exit(1);
  }
}

main();
