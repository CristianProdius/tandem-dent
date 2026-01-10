/**
 * Create First Admin Script for TandemDent
 *
 * This script creates the first admin account with email/password.
 *
 * Usage:
 *   npx tsx src/scripts/create-admin.ts --name "Admin Name" --email "admin@example.com" --password "password123"
 *   npx tsx src/scripts/create-admin.ts -n "Admin Name" -e "admin@example.com" -p "password123"
 */

import * as sdk from "node-appwrite";
import { ID } from "node-appwrite";
import * as bcrypt from "bcryptjs";

// Load environment variables
require("dotenv").config({ path: ".env.local" });

const {
  NEXT_PUBLIC_ENDPOINT: ENDPOINT,
  PROJECT_ID,
  API_KEY,
  DATABASE_ID,
  ADMIN_COLLECTION_ID,
} = process.env;

if (!ENDPOINT || !PROJECT_ID || !API_KEY || !DATABASE_ID || !ADMIN_COLLECTION_ID) {
  console.error("Missing required environment variables.");
  console.error("Required: NEXT_PUBLIC_ENDPOINT, PROJECT_ID, API_KEY, DATABASE_ID, ADMIN_COLLECTION_ID");
  process.exit(1);
}

// Initialize Appwrite client
const client = new sdk.Client();
client.setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);

const databases = new sdk.Databases(client);

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const result: Record<string, string> = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--name" || arg === "-n") {
      result.name = args[++i];
    } else if (arg === "--email" || arg === "-e") {
      result.email = args[++i];
    } else if (arg === "--password" || arg === "-p") {
      result.password = args[++i];
    } else if (arg === "--phone") {
      result.phone = args[++i];
    }
  }

  return result;
}

async function main() {
  console.log("===========================================");
  console.log("TandemDent - Create Admin Account");
  console.log("===========================================\n");

  const args = parseArgs();

  const name = args.name;
  const email = args.email;
  const password = args.password;
  const phone = args.phone;

  if (!name || !email || !password) {
    console.error("Usage: npx tsx src/scripts/create-admin.ts --name \"Admin Name\" --email \"admin@example.com\" --password \"password123\"");
    console.error("\nRequired arguments:");
    console.error("  --name, -n     Admin name");
    console.error("  --email, -e    Admin email");
    console.error("  --password, -p Admin password (min 6 characters)");
    console.error("\nOptional arguments:");
    console.error("  --phone        Phone number");
    process.exit(1);
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error("Invalid email format.");
    process.exit(1);
  }

  // Validate password length
  if (password.length < 6) {
    console.error("Password must be at least 6 characters.");
    process.exit(1);
  }

  try {
    console.log("Creating admin account...");

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create admin document
    const admin = await databases.createDocument(
      DATABASE_ID!,
      ADMIN_COLLECTION_ID!,
      ID.unique(),
      {
        name,
        email,
        phone: phone || null,
        passwordHash,
        devices: JSON.stringify([]),
      }
    );

    console.log("\n===========================================");
    console.log("Admin account created successfully!");
    console.log("===========================================");
    console.log(`ID: ${admin.$id}`);
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log("\nYou can now login at /auth/v2/login");
    console.log("===========================================");
  } catch (error: any) {
    if (error?.code === 409) {
      console.error("\nAn admin with this email already exists.");
    } else {
      console.error("\nError creating admin:", error?.message || error);
    }
    process.exit(1);
  }
}

main();
