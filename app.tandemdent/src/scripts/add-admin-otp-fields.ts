/**
 * Add OTP fields to Admin collection
 */

import * as sdk from "node-appwrite";

require("dotenv").config({ path: ".env.local" });

const { NEXT_PUBLIC_ENDPOINT: ENDPOINT, PROJECT_ID, API_KEY, DATABASE_ID, ADMIN_COLLECTION_ID } = process.env;

if (!ENDPOINT || !PROJECT_ID || !API_KEY || !DATABASE_ID || !ADMIN_COLLECTION_ID) {
  console.error("Missing required environment variables");
  process.exit(1);
}

const client = new sdk.Client();
client.setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const databases = new sdk.Databases(client);

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function addOTPFields() {
  console.log("Adding OTP fields to Admin collection...");
  console.log(`Collection ID: ${ADMIN_COLLECTION_ID}`);

  // Add otpCode field
  try {
    await databases.createStringAttribute(DATABASE_ID!, ADMIN_COLLECTION_ID!, "otpCode", 10, false);
    console.log("  Created otpCode attribute");
  } catch (e: any) {
    if (e?.code === 409) console.log("  otpCode already exists");
    else console.error("  Error:", e?.message);
  }

  // Add otpExpiresAt field
  try {
    await databases.createDatetimeAttribute(DATABASE_ID!, ADMIN_COLLECTION_ID!, "otpExpiresAt", false);
    console.log("  Created otpExpiresAt attribute");
  } catch (e: any) {
    if (e?.code === 409) console.log("  otpExpiresAt already exists");
    else console.error("  Error:", e?.message);
  }

  // Add sessionToken field
  try {
    await databases.createStringAttribute(DATABASE_ID!, ADMIN_COLLECTION_ID!, "sessionToken", 255, false);
    console.log("  Created sessionToken attribute");
  } catch (e: any) {
    if (e?.code === 409) console.log("  sessionToken already exists");
    else console.error("  Error:", e?.message);
  }

  // Add sessionExpiresAt field
  try {
    await databases.createDatetimeAttribute(DATABASE_ID!, ADMIN_COLLECTION_ID!, "sessionExpiresAt", false);
    console.log("  Created sessionExpiresAt attribute");
  } catch (e: any) {
    if (e?.code === 409) console.log("  sessionExpiresAt already exists");
    else console.error("  Error:", e?.message);
  }

  console.log("Waiting for attributes to be ready...");
  await sleep(3000);

  // Add sessionToken index
  try {
    await databases.createIndex(DATABASE_ID!, ADMIN_COLLECTION_ID!, "sessionToken_idx", "key", ["sessionToken"]);
    console.log("  Created sessionToken_idx index");
  } catch (e: any) {
    if (e?.code === 409) console.log("  sessionToken_idx already exists");
    else console.error("  Error:", e?.message);
  }

  console.log("\nDone! OTP fields added to Admin collection.");
}

addOTPFields();
