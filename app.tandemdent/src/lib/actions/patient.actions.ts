"use server";

import { ID, InputFile, Query } from "node-appwrite";

import {
  BUCKET_ID,
  DATABASE_ID,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  databases,
  storage,
  users,
} from "@/lib/appwrite/appwrite.config";
import { parseStringify } from "@/lib/utils";

// CREATE APPWRITE USER
export const createUser = async (user: CreateUserParams) => {
  try {
    const newuser = await users.create(ID.unique(), user.email, user.phone, undefined, user.name);

    return parseStringify(newuser);
  } catch (error: unknown) {
    const err = error as { code?: number; message?: string; type?: string; response?: unknown };
    console.error("Appwrite user creation error:", {
      code: err?.code,
      message: err?.message,
      type: err?.type,
      response: err?.response,
    });

    if (err && err?.code === 409) {
      const byEmail = await users.list([Query.equal("email", [user.email])]);

      if (byEmail.users[0]) {
        return byEmail.users[0];
      }

      if (user.phone) {
        const byPhone = await users.list([Query.equal("phone", [user.phone])]);

        if (byPhone.users[0]) {
          return byPhone.users[0];
        }
      }

      throw new Error("Un utilizator cu acest email sau telefon există deja");
    }

    const errorMessage =
      err?.message || (err?.response as { message?: string })?.message || "Unknown Appwrite error";
    throw new Error(`Appwrite: ${errorMessage}`);
  }
};

// GET USER
export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);

    return parseStringify(user);
  } catch (error) {
    console.error("An error occurred while retrieving the user details:", error);
  }
};

// REGISTER PATIENT
export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    let file;
    if (identificationDocument) {
      const inputFile =
        identificationDocument &&
        InputFile.fromBlob(
          identificationDocument?.get("blobFile") as Blob,
          identificationDocument?.get("fileName") as string
        );

      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
    }

    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id ? file.$id : null,
        identificationDocumentUrl: file?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
          : null,
        ...patient,
      }
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
  }
};

// GET PATIENT
export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(DATABASE_ID!, PATIENT_COLLECTION_ID!, [
      Query.equal("userId", [userId]),
    ]);

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.error("An error occurred while retrieving the patient details:", error);
  }
};

// GET PATIENT BY ID (document ID)
export const getPatientById = async (patientId: string) => {
  try {
    const patient = await databases.getDocument(DATABASE_ID!, PATIENT_COLLECTION_ID!, patientId);

    return parseStringify(patient);
  } catch (error) {
    console.error("An error occurred while retrieving the patient details:", error);
  }
};

// SEARCH PATIENTS by name, email, or phone
export const searchPatients = async (query: string) => {
  try {
    const results = await databases.listDocuments(DATABASE_ID!, PATIENT_COLLECTION_ID!, [
      Query.search("name", query),
      Query.limit(20),
    ]);

    if (results.documents.length === 0 && query.includes("@")) {
      const emailResults = await databases.listDocuments(DATABASE_ID!, PATIENT_COLLECTION_ID!, [
        Query.equal("email", query),
        Query.limit(20),
      ]);
      return parseStringify(emailResults.documents);
    }

    if (results.documents.length === 0 && /^\+?\d+$/.test(query.replace(/\s/g, ""))) {
      const phoneResults = await databases.listDocuments(DATABASE_ID!, PATIENT_COLLECTION_ID!, [
        Query.equal("phone", query),
        Query.limit(20),
      ]);
      return parseStringify(phoneResults.documents);
    }

    return parseStringify(results.documents);
  } catch (error) {
    console.error("An error occurred while searching patients:", error);
    return [];
  }
};

// GET ALL PATIENTS with pagination
export const getPatients = async (page: number = 1, limit: number = 25) => {
  try {
    const offset = (page - 1) * limit;

    const patients = await databases.listDocuments(DATABASE_ID!, PATIENT_COLLECTION_ID!, [
      Query.orderDesc("$createdAt"),
      Query.limit(limit),
      Query.offset(offset),
    ]);

    return {
      patients: parseStringify(patients.documents),
      total: patients.total,
      totalPages: Math.ceil(patients.total / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("An error occurred while getting patients:", error);
    return { patients: [], total: 0, totalPages: 0, currentPage: 1 };
  }
};

// UPDATE PATIENT
export const updatePatient = async (patientId: string, data: Partial<RegisterUserParams>) => {
  try {
    const updatedPatient = await databases.updateDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      patientId,
      data
    );

    return parseStringify(updatedPatient);
  } catch (error) {
    console.error("An error occurred while updating the patient:", error);
  }
};

// GET PATIENT STATS
export const getPatientStats = async () => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const [thisMonthData, thisWeekData] = await Promise.all([
      databases.listDocuments(DATABASE_ID!, PATIENT_COLLECTION_ID!, [
        Query.greaterThanEqual("$createdAt", startOfMonth.toISOString()),
        Query.limit(1),
      ]),
      databases.listDocuments(DATABASE_ID!, PATIENT_COLLECTION_ID!, [
        Query.greaterThanEqual("$createdAt", startOfWeek.toISOString()),
        Query.limit(1),
      ]),
    ]);

    return {
      thisMonth: thisMonthData.total,
      thisWeek: thisWeekData.total,
    };
  } catch (error) {
    console.error("Error getting patient stats:", error);
    return { thisMonth: 0, thisWeek: 0 };
  }
};

// CREATE PATIENT (admin flow - simplified, without self-service)
export const createPatientAdmin = async (patient: {
  name: string;
  email: string;
  phone: string;
  birthDate?: Date;
  gender?: Gender;
  primaryPhysician?: string;
}) => {
  try {
    const newUser = await createUser({
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
    });

    if (!newUser) {
      throw new Error("Failed to create user");
    }

    const existingPatients = await databases.listDocuments(DATABASE_ID!, PATIENT_COLLECTION_ID!, [
      Query.equal("userId", [newUser.$id]),
    ]);

    if (existingPatients.documents.length > 0) {
      return parseStringify(existingPatients.documents[0]);
    }

    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        userId: newUser.$id,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        birthDate: patient.birthDate || new Date(),
        gender: patient.gender || "male",
        primaryPhysician: patient.primaryPhysician || "",
        privacyConsent: true,
        address: "",
        occupation: "",
        emergencyContactName: "",
        emergencyContactNumber: "",
        insuranceProvider: "",
        insurancePolicyNumber: "",
      }
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.error("An error occurred while creating the patient:", error);
    throw error;
  }
};
