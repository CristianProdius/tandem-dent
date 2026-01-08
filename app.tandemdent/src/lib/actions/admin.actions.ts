"use server";

import { Query } from "node-appwrite";

import {
  databases,
  DATABASE_ID,
  ADMIN_COLLECTION_ID,
} from "@/lib/appwrite/appwrite.config";
import type { Admin } from "@/types/appwrite.types";

/**
 * Get admin by email
 */
export async function getAdminByEmail(email: string): Promise<Admin | null> {
  try {
    if (!ADMIN_COLLECTION_ID) {
      console.error("ADMIN_COLLECTION_ID not configured");
      return null;
    }

    const admins = await databases.listDocuments(DATABASE_ID!, ADMIN_COLLECTION_ID, [
      Query.equal("email", email),
    ]);

    return (admins.documents[0] as unknown as Admin) || null;
  } catch (error) {
    console.error("Error finding admin by email:", error);
    return null;
  }
}

/**
 * Get admin by ID
 */
export async function getAdminById(adminId: string): Promise<Admin | null> {
  try {
    if (!ADMIN_COLLECTION_ID) {
      console.error("ADMIN_COLLECTION_ID not configured");
      return null;
    }

    const admin = await databases.getDocument(DATABASE_ID!, ADMIN_COLLECTION_ID, adminId);
    return admin as unknown as Admin;
  } catch (error) {
    console.error("Error finding admin by ID:", error);
    return null;
  }
}

/**
 * Get admin by Appwrite Auth ID
 */
export async function getAdminByAuthId(authId: string): Promise<Admin | null> {
  try {
    if (!ADMIN_COLLECTION_ID) {
      console.error("ADMIN_COLLECTION_ID not configured");
      return null;
    }

    const admins = await databases.listDocuments(DATABASE_ID!, ADMIN_COLLECTION_ID, [
      Query.equal("appwriteAuthId", authId),
    ]);

    return (admins.documents[0] as unknown as Admin) || null;
  } catch (error) {
    console.error("Error finding admin by auth ID:", error);
    return null;
  }
}

/**
 * Get all admins
 */
export async function getAdmins(): Promise<Admin[]> {
  try {
    if (!ADMIN_COLLECTION_ID) {
      console.error("ADMIN_COLLECTION_ID not configured");
      return [];
    }

    const admins = await databases.listDocuments(DATABASE_ID!, ADMIN_COLLECTION_ID);
    return admins.documents as unknown as Admin[];
  } catch (error) {
    console.error("Error getting admins:", error);
    return [];
  }
}
