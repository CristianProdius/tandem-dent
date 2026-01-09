#!/usr/bin/env node
/**
 * Script to set up password for an existing admin user
 *
 * Usage:
 *   node scripts/setup-admin-password.mjs <email> <password>
 *
 * Example:
 *   node scripts/setup-admin-password.mjs admin@tandemdent.md MySecurePassword123
 */

import { createHash, scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { Client, Databases, Query } from 'node-appwrite';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
config({ path: join(__dirname, '..', '.env.local') });

const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const key = await scryptAsync(password, salt, 64);
  return `${salt}:${key.toString('hex')}`;
}

function validatePassword(password) {
  const errors = [];
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  return { valid: errors.length === 0, errors };
}

async function main() {
  const [email, password] = process.argv.slice(2);

  if (!email || !password) {
    console.error('Usage: node scripts/setup-admin-password.mjs <email> <password>');
    console.error('Example: node scripts/setup-admin-password.mjs admin@tandemdent.md MySecurePassword123');
    process.exit(1);
  }

  // Validate password
  const validation = validatePassword(password);
  if (!validation.valid) {
    console.error('Password validation failed:');
    validation.errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }

  // Check environment variables
  const { NEXT_PUBLIC_ENDPOINT, PROJECT_ID, API_KEY, DATABASE_ID, ADMIN_COLLECTION_ID } = process.env;

  if (!NEXT_PUBLIC_ENDPOINT || !PROJECT_ID || !API_KEY || !DATABASE_ID || !ADMIN_COLLECTION_ID) {
    console.error('Missing required environment variables. Make sure .env.local exists with:');
    console.error('  - NEXT_PUBLIC_ENDPOINT');
    console.error('  - PROJECT_ID');
    console.error('  - API_KEY');
    console.error('  - DATABASE_ID');
    console.error('  - ADMIN_COLLECTION_ID');
    process.exit(1);
  }

  // Initialize Appwrite client
  const client = new Client();
  client
    .setEndpoint(NEXT_PUBLIC_ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

  const databases = new Databases(client);

  try {
    // Find admin by email
    console.log(`Looking for admin with email: ${email}...`);

    const admins = await databases.listDocuments(DATABASE_ID, ADMIN_COLLECTION_ID, [
      Query.equal('email', email),
    ]);

    if (admins.documents.length === 0) {
      console.error(`No admin found with email: ${email}`);
      process.exit(1);
    }

    const admin = admins.documents[0];
    console.log(`Found admin: ${admin.name} (${admin.$id})`);

    // Hash the password
    console.log('Hashing password...');
    const passwordHash = await hashPassword(password);

    // Update the admin document
    console.log('Updating admin with password...');
    await databases.updateDocument(DATABASE_ID, ADMIN_COLLECTION_ID, admin.$id, {
      passwordHash,
    });

    console.log('\n✅ Password set successfully!');
    console.log(`\nYou can now login at /auth/v2/login with:`);
    console.log(`  Email: ${email}`);
    console.log(`  Password: ${password}`);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
