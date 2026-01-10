/**
 * Migration script: Update OTP fields for Appwrite OTP authentication
 *
 * This script:
 * 1. Adds appwriteOtpUserId to Admin, Doctor, Patient collections
 * 2. Deletes magicLinkToken and magicLinkExpiresAt from Admin and Doctor (kept for Patient magic links)
 * 3. Verifies all required fields exist
 *
 * Run: npx tsx src/scripts/migrate-otp-fields.ts
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

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Required fields for each collection
const REQUIRED_FIELDS = {
  admin: [
    "name",
    "email",
    "passwordHash",
    "sessionToken",
    "sessionExpiresAt",
    "devices",
    "appwriteOtpUserId", // NEW - for Appwrite OTP
  ],
  doctor: [
    "name",
    "email",
    "passwordHash",
    "sessionToken",
    "sessionExpiresAt",
    "devices",
    "appwriteOtpUserId", // NEW - for Appwrite OTP
  ],
  patient: [
    "name",
    "email",
    "phone",
    "passwordHash",
    "sessionToken",
    "sessionExpiresAt",
    "devices",
    "magicLinkToken", // KEEP - for patient magic link login
    "magicLinkExpiresAt", // KEEP - for patient magic link login
    "appwriteOtpUserId", // NEW - for Appwrite OTP
  ],
};

// Fields to DELETE from collections
const FIELDS_TO_DELETE = {
  admin: ["magicLinkToken", "magicLinkExpiresAt"],
  doctor: ["magicLinkToken", "magicLinkExpiresAt"],
  patient: [], // Keep magic link fields for patient
};

async function getCollectionAttributes(collectionId: string): Promise<string[]> {
  try {
    const collection = await databases.getCollection(DATABASE_ID!, collectionId);
    return collection.attributes.map((attr: any) => attr.key);
  } catch (error: any) {
    console.error(`Error getting collection ${collectionId}:`, error?.message);
    return [];
  }
}

async function addAttribute(collectionId: string, key: string): Promise<boolean> {
  try {
    await databases.createStringAttribute(DATABASE_ID!, collectionId, key, 255, false);
    console.log(`  + Created ${key}`);
    return true;
  } catch (error: any) {
    if (error?.code === 409) {
      console.log(`  = ${key} already exists`);
      return false;
    }
    console.error(`  ! Error creating ${key}:`, error?.message);
    return false;
  }
}

async function deleteAttribute(collectionId: string, key: string): Promise<boolean> {
  try {
    await databases.deleteAttribute(DATABASE_ID!, collectionId, key);
    console.log(`  - Deleted ${key}`);
    return true;
  } catch (error: any) {
    if (error?.code === 404) {
      console.log(`  = ${key} doesn't exist (already deleted)`);
      return false;
    }
    console.error(`  ! Error deleting ${key}:`, error?.message);
    return false;
  }
}

async function migrateCollection(
  name: string,
  collectionId: string | undefined,
  requiredFields: string[],
  fieldsToDelete: string[]
) {
  console.log(`\n${"=".repeat(50)}`);
  console.log(`${name.toUpperCase()} COLLECTION`);
  console.log(`${"=".repeat(50)}`);

  if (!collectionId) {
    console.log(`  ! Collection ID not configured, skipping...`);
    return;
  }

  console.log(`Collection ID: ${collectionId}\n`);

  // Get current attributes
  const existingAttributes = await getCollectionAttributes(collectionId);
  console.log(`Current attributes: ${existingAttributes.length}`);

  // Delete old fields
  if (fieldsToDelete.length > 0) {
    console.log(`\nDeleting deprecated fields...`);
    for (const field of fieldsToDelete) {
      if (existingAttributes.includes(field)) {
        await deleteAttribute(collectionId, field);
        await sleep(1000); // Wait between operations
      } else {
        console.log(`  = ${field} doesn't exist (already deleted)`);
      }
    }
  }

  // Add new required fields
  console.log(`\nAdding/checking required fields...`);
  let addedCount = 0;
  for (const field of requiredFields) {
    if (!existingAttributes.includes(field)) {
      const added = await addAttribute(collectionId, field);
      if (added) {
        addedCount++;
        await sleep(1000); // Wait between operations
      }
    } else {
      console.log(`  = ${field} already exists`);
    }
  }

  // Verify final state
  console.log(`\nVerifying fields...`);
  await sleep(2000); // Wait for Appwrite to process
  const finalAttributes = await getCollectionAttributes(collectionId);

  const missingFields = requiredFields.filter((f) => !finalAttributes.includes(f));
  const deletedFields = fieldsToDelete.filter((f) => !finalAttributes.includes(f));

  if (missingFields.length === 0) {
    console.log(`  All required fields present`);
  } else {
    console.log(`  ! Missing fields: ${missingFields.join(", ")}`);
  }

  if (fieldsToDelete.length > 0) {
    if (deletedFields.length === fieldsToDelete.length) {
      console.log(`  All deprecated fields deleted`);
    } else {
      const remaining = fieldsToDelete.filter((f) => finalAttributes.includes(f));
      console.log(`  ! Fields still present: ${remaining.join(", ")}`);
    }
  }
}

async function main() {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║     Appwrite OTP Migration Script                              ║
║     Migrating from custom OTP to Appwrite OTP                  ║
╚════════════════════════════════════════════════════════════════╝
`);

  console.log("Database ID:", DATABASE_ID);
  console.log("Admin Collection:", ADMIN_COLLECTION_ID || "NOT SET");
  console.log("Doctor Collection:", DOCTOR_COLLECTION_ID || "NOT SET");
  console.log("Patient Collection:", PATIENT_COLLECTION_ID || "NOT SET");

  // Migrate Admin collection
  await migrateCollection(
    "Admin",
    ADMIN_COLLECTION_ID,
    REQUIRED_FIELDS.admin,
    FIELDS_TO_DELETE.admin
  );

  // Migrate Doctor collection
  await migrateCollection(
    "Doctor",
    DOCTOR_COLLECTION_ID,
    REQUIRED_FIELDS.doctor,
    FIELDS_TO_DELETE.doctor
  );

  // Migrate Patient collection
  await migrateCollection(
    "Patient",
    PATIENT_COLLECTION_ID,
    REQUIRED_FIELDS.patient,
    FIELDS_TO_DELETE.patient
  );

  console.log(`
╔════════════════════════════════════════════════════════════════╗
║     Migration Complete!                                        ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  Next steps:                                                   ║
║  1. Configure Resend SMTP in Appwrite Console                  ║
║     - Go to Messaging -> Providers -> Add SMTP                 ║
║     - Host: smtp.resend.com, Port: 587                         ║
║     - Username: resend                                         ║
║     - Password: Your Resend API key                            ║
║     - Sender: clinica@tandemdent.md                            ║
║                                                                ║
║  2. Test the authentication flow                               ║
║     - Login with email/password from new device                ║
║     - Verify OTP email arrives from your domain                ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`);
}

main().catch(console.error);
