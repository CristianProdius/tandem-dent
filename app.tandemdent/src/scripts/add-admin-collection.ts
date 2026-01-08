/**
 * Add Admin Collection and Doctor Auth Fields Script
 *
 * This script adds the Admin collection and authentication fields to the Doctor collection.
 * Run this ONCE to update your existing Appwrite setup.
 *
 * Usage: npx ts-node --compiler-options '{"module":"CommonJS"}' src/scripts/add-admin-collection.ts
 */

import * as sdk from "node-appwrite";
import { ID, Permission, Role } from "node-appwrite";

// Load environment variables
require("dotenv").config({ path: ".env.local" });

const {
  NEXT_PUBLIC_ENDPOINT: ENDPOINT,
  PROJECT_ID,
  API_KEY,
  DATABASE_ID,
  DOCTOR_COLLECTION_ID,
} = process.env;

if (!ENDPOINT || !PROJECT_ID || !API_KEY || !DATABASE_ID) {
  console.error("Missing required environment variables.");
  console.error("Please ensure DATABASE_ID is set in .env.local");
  process.exit(1);
}

// Initialize Appwrite client
const client = new sdk.Client();
client.setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);

const databases = new sdk.Databases(client);

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createAdminCollection() {
  console.log("\n--- Creating Admin Collection ---");

  try {
    const collection = await databases.createCollection(
      DATABASE_ID!,
      ID.unique(),
      "admin",
      [
        Permission.read(Role.any()),
        Permission.create(Role.any()),
        Permission.update(Role.any()),
        Permission.delete(Role.any()),
      ]
    );
    console.log(`  Created collection: ${collection.name} (${collection.$id})`);

    // Create attributes
    const attributes = [
      { type: "string", key: "name", size: 200, required: true },
      { type: "string", key: "email", size: 200, required: true },
      { type: "string", key: "avatar", size: 1000, required: false },
      { type: "string", key: "phone", size: 50, required: false },
      { type: "string", key: "appwriteAuthId", size: 255, required: false },
    ];

    for (const attr of attributes) {
      try {
        console.log(`    Creating attribute: ${attr.key}`);
        await databases.createStringAttribute(
          DATABASE_ID!,
          collection.$id,
          attr.key,
          attr.size,
          attr.required
        );
        await sleep(100);
      } catch (error: any) {
        if (error?.code === 409) {
          console.log(`      Attribute ${attr.key} already exists`);
        } else {
          console.error(`      Error creating attribute ${attr.key}:`, error?.message);
        }
      }
    }

    // Wait for attributes to be ready
    console.log("    Waiting for attributes to be ready...");
    await sleep(3000);

    // Create indexes
    const indexes = [
      { key: "email_idx", type: "unique" as const, attributes: ["email"] },
      { key: "appwriteAuthId_idx", type: "key" as const, attributes: ["appwriteAuthId"] },
    ];

    for (const idx of indexes) {
      try {
        console.log(`    Creating index: ${idx.key}`);
        await databases.createIndex(
          DATABASE_ID!,
          collection.$id,
          idx.key,
          idx.type,
          idx.attributes
        );
        await sleep(100);
      } catch (error: any) {
        if (error?.code === 409) {
          console.log(`      Index ${idx.key} already exists`);
        } else {
          console.error(`      Error creating index ${idx.key}:`, error?.message);
        }
      }
    }

    return collection.$id;
  } catch (error: any) {
    if (error?.code === 409) {
      console.log("  Admin collection already exists, fetching...");
      const collections = await databases.listCollections(DATABASE_ID!);
      const existing = collections.collections.find((c) => c.name === "admin");
      if (existing) {
        console.log(`  Using existing collection: ${existing.name} (${existing.$id})`);
        return existing.$id;
      }
    }
    throw error;
  }
}

async function addDoctorAuthFields() {
  if (!DOCTOR_COLLECTION_ID) {
    console.log("\n--- Skipping Doctor Auth Fields (DOCTOR_COLLECTION_ID not set) ---");
    return;
  }

  console.log("\n--- Adding Auth Fields to Doctor Collection ---");

  const authFields = [
    { key: "appwriteAuthId", size: 255 },
    { key: "magicLinkToken", size: 255 },
    { key: "sessionToken", size: 255 },
  ];

  const datetimeFields = [
    { key: "magicLinkExpiresAt" },
    { key: "sessionExpiresAt" },
  ];

  for (const attr of authFields) {
    try {
      console.log(`  Creating attribute: ${attr.key}`);
      await databases.createStringAttribute(
        DATABASE_ID!,
        DOCTOR_COLLECTION_ID,
        attr.key,
        attr.size,
        false // not required
      );
      await sleep(100);
    } catch (error: any) {
      if (error?.code === 409) {
        console.log(`    Attribute ${attr.key} already exists`);
      } else {
        console.error(`    Error creating attribute ${attr.key}:`, error?.message);
      }
    }
  }

  for (const attr of datetimeFields) {
    try {
      console.log(`  Creating datetime attribute: ${attr.key}`);
      await databases.createDatetimeAttribute(
        DATABASE_ID!,
        DOCTOR_COLLECTION_ID,
        attr.key,
        false // not required
      );
      await sleep(100);
    } catch (error: any) {
      if (error?.code === 409) {
        console.log(`    Attribute ${attr.key} already exists`);
      } else {
        console.error(`    Error creating attribute ${attr.key}:`, error?.message);
      }
    }
  }

  // Wait for attributes to be ready
  console.log("  Waiting for attributes to be ready...");
  await sleep(3000);

  // Create sessionToken index
  try {
    console.log("  Creating index: sessionToken_idx");
    await databases.createIndex(
      DATABASE_ID!,
      DOCTOR_COLLECTION_ID,
      "sessionToken_idx",
      "key",
      ["sessionToken"]
    );
  } catch (error: any) {
    if (error?.code === 409) {
      console.log("    Index sessionToken_idx already exists");
    } else {
      console.error("    Error creating index:", error?.message);
    }
  }
}

async function main() {
  console.log("===========================================");
  console.log("TandemDent - Add Admin Collection Script");
  console.log("===========================================");
  console.log(`Endpoint: ${ENDPOINT}`);
  console.log(`Database ID: ${DATABASE_ID}`);

  try {
    // Create Admin collection
    const adminCollectionId = await createAdminCollection();

    // Add auth fields to Doctor collection
    await addDoctorAuthFields();

    console.log("\n===========================================");
    console.log("Setup Complete!");
    console.log("===========================================");
    console.log("\nAdd this to your .env.local file:\n");
    console.log(`ADMIN_COLLECTION_ID=${adminCollectionId}`);
    console.log("\n===========================================");
    console.log("\nNext steps:");
    console.log("1. Add the ADMIN_COLLECTION_ID to your .env.local");
    console.log("2. Go to Appwrite Console > Database > admin collection");
    console.log("3. Create a new document with your admin info:");
    console.log("   - name: Your Name");
    console.log("   - email: your.email@example.com");
    console.log("   - (optional) avatar: URL to avatar image");
    console.log("   - (optional) phone: Your phone number");
    console.log("===========================================");
  } catch (error) {
    console.error("\nFatal error during setup:", error);
    process.exit(1);
  }
}

main();
