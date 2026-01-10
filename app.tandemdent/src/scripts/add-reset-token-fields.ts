/**
 * Add Password Reset Fields to Collections
 *
 * Adds resetToken and resetTokenExpiry fields to Admin, Doctor, and Patient collections.
 *
 * Usage:
 *   npx tsx src/scripts/add-reset-token-fields.ts
 */

import * as sdk from "node-appwrite";

require("dotenv").config({ path: ".env.local" });

const {
  NEXT_PUBLIC_ENDPOINT: ENDPOINT,
  PROJECT_ID,
  API_KEY,
  DATABASE_ID,
  ADMIN_COLLECTION_ID,
  DOCTOR_COLLECTION_ID,
  PATIENT_COLLECTION_ID,
} = process.env;

if (!ENDPOINT || !PROJECT_ID || !API_KEY || !DATABASE_ID) {
  console.error("Missing required environment variables");
  process.exit(1);
}

const client = new sdk.Client();
client.setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const databases = new sdk.Databases(client);

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function addFieldsToCollection(collectionId: string, collectionName: string) {
  console.log(`\n--- ${collectionName} Collection ---`);

  // Add resetToken field
  try {
    await databases.createStringAttribute(DATABASE_ID!, collectionId, "resetToken", 255, false);
    console.log("  + Created resetToken");
  } catch (e: any) {
    if (e?.code === 409) console.log("  = resetToken already exists");
    else console.error("  Error:", e?.message);
  }

  // Add resetTokenExpiry field
  try {
    await databases.createDatetimeAttribute(DATABASE_ID!, collectionId, "resetTokenExpiry", false);
    console.log("  + Created resetTokenExpiry");
  } catch (e: any) {
    if (e?.code === 409) console.log("  = resetTokenExpiry already exists");
    else console.error("  Error:", e?.message);
  }

  await sleep(500);
}

async function main() {
  console.log("===========================================");
  console.log("Adding Password Reset Fields");
  console.log("===========================================");

  if (ADMIN_COLLECTION_ID) {
    await addFieldsToCollection(ADMIN_COLLECTION_ID, "Admin");
  }

  if (DOCTOR_COLLECTION_ID) {
    await addFieldsToCollection(DOCTOR_COLLECTION_ID, "Doctor");
  }

  if (PATIENT_COLLECTION_ID) {
    await addFieldsToCollection(PATIENT_COLLECTION_ID, "Patient");
  }

  console.log("\n===========================================");
  console.log("Done! Password reset fields added.");
  console.log("===========================================");
}

main();
