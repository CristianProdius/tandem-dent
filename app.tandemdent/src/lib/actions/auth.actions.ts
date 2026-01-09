"use server";

import { cookies, headers } from "next/headers";
import { ID, Query } from "node-appwrite";

import {
  databases,
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
  DOCTOR_COLLECTION_ID,
  ADMIN_COLLECTION_ID,
  users,
  account,
  messaging,
} from "@/lib/appwrite/appwrite.config";
import { resend, EMAIL_FROM } from "@/lib/resend/resend.config";
import type { Patient, Admin, Doctor, UserRole } from "@/types/appwrite.types";
import {
  hashPassword,
  verifyPassword,
  generateDeviceId,
  parseDevices,
  stringifyDevices,
  addOrUpdateDevice,
  removeDevice as removeDeviceFromList,
  isKnownDevice,
  validatePassword,
  type DeviceFingerprint,
} from "@/lib/utils/password";

const SESSION_COOKIE_NAME = "tandemdent_session";
const ADMIN_SESSION_COOKIE_NAME = "tandemdent_admin_session";
const DOCTOR_SESSION_COOKIE_NAME = "tandemdent_doctor_session";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// ===========================================
// Logged-In User (Admin or Doctor)
// ===========================================

export type LoggedInUser = {
  type: UserRole;
  user: Admin | Doctor;
} | null;

/**
 * Get the currently logged-in user (admin or doctor)
 * Checks admin session first, then doctor session
 */
export async function getLoggedInUser(): Promise<LoggedInUser> {
  try {
    const cookieStore = await cookies();

    // Check admin session first (using session token)
    const adminSessionToken = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;
    if (adminSessionToken && ADMIN_COLLECTION_ID) {
      try {
        const admins = await databases.listDocuments(DATABASE_ID!, ADMIN_COLLECTION_ID, [
          Query.equal("sessionToken", adminSessionToken),
        ]);

        if (admins.documents.length > 0) {
          const admin = admins.documents[0] as unknown as Admin;

          // Check if session is expired
          if (admin.sessionExpiresAt && new Date(admin.sessionExpiresAt) > new Date()) {
            return {
              type: "admin",
              user: admin,
            };
          }
        }
      } catch (e) {
        console.error("Error fetching admin session:", e);
      }
    }

    // Check doctor session
    const doctorSessionCookie = cookieStore.get(DOCTOR_SESSION_COOKIE_NAME)?.value;
    if (doctorSessionCookie && DOCTOR_COLLECTION_ID) {
      // Doctor sessions store the session token directly
      const sessionToken = doctorSessionCookie;

      try {
        const doctors = await databases.listDocuments(DATABASE_ID!, DOCTOR_COLLECTION_ID, [
          Query.equal("sessionToken", sessionToken),
        ]);

        if (doctors.documents.length > 0) {
          const doctor = doctors.documents[0] as unknown as Doctor;

          // Check if session is expired
          if (doctor.sessionExpiresAt && new Date(doctor.sessionExpiresAt) > new Date()) {
            return {
              type: "doctor",
              user: doctor,
            };
          }
        }
      } catch (e) {
        console.error("Error fetching doctor session:", e);
      }
    }

    return null;
  } catch (error) {
    console.error("Error getting logged-in user:", error);
    return null;
  }
}

// ===========================================
// Admin Authentication (Appwrite Auth OTP)
// ===========================================

/**
 * Send OTP to admin email using Appwrite Auth's email token system
 */
export async function sendAdminEmailOTP(email: string): Promise<{ success: boolean; adminId?: string; userId?: string; error?: string }> {
  try {
    if (!ADMIN_COLLECTION_ID) {
      return { success: false, error: "Configurație incompletă" };
    }

    // Find admin by email in our Admin collection
    const admins = await databases.listDocuments(DATABASE_ID!, ADMIN_COLLECTION_ID, [
      Query.equal("email", email),
    ]);

    if (admins.documents.length === 0) {
      // Return success to prevent email enumeration
      return { success: true };
    }

    const admin = admins.documents[0] as unknown as Admin;

    // Check if admin has an Appwrite Auth user, if not create one
    let appwriteUserId = admin.appwriteAuthId;

    if (!appwriteUserId) {
      try {
        // Try to find existing user by email
        const existingUsers = await users.list([Query.equal("email", email)]);

        if (existingUsers.users.length > 0) {
          appwriteUserId = existingUsers.users[0].$id;
        } else {
          // Create a new Appwrite Auth user for this admin
          const newUser = await users.create(
            ID.unique(),
            email,
            undefined, // phone
            undefined, // password
            admin.name
          );
          appwriteUserId = newUser.$id;
        }

        // Store the Appwrite user ID in admin record
        await databases.updateDocument(DATABASE_ID!, ADMIN_COLLECTION_ID, admin.$id, {
          appwriteAuthId: appwriteUserId,
        });
      } catch (e: any) {
        console.error("Error creating/finding Appwrite user:", e);
        return { success: false, error: "Eroare la crearea utilizatorului" };
      }
    }

    // Send OTP using Appwrite Auth's email token system (via account.createEmailToken)
    // This uses the SMTP configured in Appwrite Console
    try {
      // Use account.createEmailToken - this sends an OTP email via Appwrite's configured SMTP
      const token = await account.createEmailToken(appwriteUserId, email);

      return {
        success: true,
        adminId: admin.$id,
        userId: appwriteUserId,
      };
    } catch (e: any) {
      console.error("Error sending Appwrite email token:", e);
      return { success: false, error: "Eroare la trimiterea codului OTP" };
    }
  } catch (error) {
    console.error("Error sending admin OTP:", error);
    return { success: false, error: "Eroare la trimiterea codului" };
  }
}

/**
 * Verify admin OTP and create session using Appwrite Auth
 */
export async function verifyAdminOTP(
  adminId: string,
  otp: string,
  userId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!ADMIN_COLLECTION_ID) {
      return { success: false, error: "Configurație incompletă" };
    }

    // Get admin by ID
    const admin = await databases.getDocument(DATABASE_ID!, ADMIN_COLLECTION_ID, adminId) as unknown as Admin;

    // Get the Appwrite user ID
    const appwriteUserId = userId || admin.appwriteAuthId;

    if (!appwriteUserId) {
      return { success: false, error: "Utilizator negăsit" };
    }

    // Verify OTP with Appwrite Auth and create session
    try {
      // Create session using the OTP (this verifies the OTP)
      const session = await account.createSession(appwriteUserId, otp);

      // Generate our own session token for cookie-based auth
      const sessionToken = ID.unique();
      const sessionExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      // Store session token in admin record
      await databases.updateDocument(DATABASE_ID!, ADMIN_COLLECTION_ID, admin.$id, {
        sessionToken,
        sessionExpiresAt: sessionExpiresAt.toISOString(),
      });

      // Set session cookie
      const cookieStore = await cookies();
      cookieStore.set(ADMIN_SESSION_COOKIE_NAME, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return { success: true };
    } catch (e: any) {
      console.error("Appwrite session creation error:", e);
      if (e?.code === 401) {
        return { success: false, error: "Cod OTP invalid sau expirat" };
      }
      return { success: false, error: "Eroare de verificare" };
    }
  } catch (error) {
    console.error("Error verifying admin OTP:", error);
    return { success: false, error: "Eroare de verificare" };
  }
}

/**
 * Verify admin passkey (fallback method)
 */
export async function verifyAdminPasskey(passkey: string): Promise<{ success: boolean; error?: string }> {
  const correctPasskey = process.env.NEXT_PUBLIC_ADMIN_PASSKEY || "123456";

  if (passkey !== correctPasskey) {
    return { success: false, error: "Invalid passkey" };
  }

  // Store admin session in cookie
  const cookieStore = await cookies();
  const sessionData = {
    type: "passkey",
    authenticatedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };

  cookieStore.set(ADMIN_SESSION_COOKIE_NAME, JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return { success: true };
}

/**
 * Check if admin is authenticated
 */
export async function getAdminSession(): Promise<{ authenticated: boolean; session?: { type: string; expiresAt: string } }> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      return { authenticated: false };
    }

    const session = JSON.parse(sessionCookie);

    // Check if session is expired
    if (new Date(session.expiresAt) < new Date()) {
      await logoutAdmin();
      return { authenticated: false };
    }

    return { authenticated: true, session };
  } catch (error) {
    console.error("Error getting admin session:", error);
    return { authenticated: false };
  }
}

/**
 * Logout admin
 */
export async function logoutAdmin(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;

    if (sessionToken && ADMIN_COLLECTION_ID) {
      // Find and clear admin session
      const admins = await databases.listDocuments(DATABASE_ID!, ADMIN_COLLECTION_ID, [
        Query.equal("sessionToken", sessionToken),
      ]);

      if (admins.documents.length > 0) {
        await databases.updateDocument(
          DATABASE_ID!,
          ADMIN_COLLECTION_ID,
          admins.documents[0].$id,
          {
            sessionToken: null,
            sessionExpiresAt: null,
          }
        );
      }
    }

    // Clear cookie
    cookieStore.delete(ADMIN_SESSION_COOKIE_NAME);
    return { success: true };
  } catch (error) {
    console.error("Error logging out admin:", error);
    return { success: false };
  }
}

// ===========================================
// Patient Authentication (Magic Link)
// ===========================================

const createMagicLinkEmailHtml = (data: {
  patientName: string;
  magicLink: string;
  expiresInMinutes: number;
}) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #d4af37, #b8860b); padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #d4af37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .warning { color: #666; font-size: 14px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Autentificare Tandem Dent</h1>
    </div>
    <div class="content">
      <p>Dragă ${data.patientName},</p>
      <p>Ați solicitat accesul la portalul pacienților Tandem Dent.</p>
      <p>Apăsați butonul de mai jos pentru a vă autentifica:</p>
      <a href="${data.magicLink}" class="button">Accesează Portalul</a>
      <p class="warning">Acest link expiră în ${data.expiresInMinutes} minute.</p>
      <p class="warning">Dacă nu ați solicitat acest email, îl puteți ignora.</p>
    </div>
    <div class="footer">
      <p>Tandem Dent - ${BASE_URL}</p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Find patient by email
 */
export async function getPatientByEmail(email: string) {
  try {
    const patients = await databases.listDocuments(DATABASE_ID!, PATIENT_COLLECTION_ID!, [
      Query.equal("email", email),
    ]);

    return (patients.documents[0] as unknown as Patient) || null;
  } catch (error) {
    console.error("Error finding patient by email:", error);
    return null;
  }
}

/**
 * Generate and send magic link to patient email
 */
export async function sendPatientMagicLink(email: string) {
  try {
    // First, check if patient exists
    const patient = await getPatientByEmail(email);

    if (!patient) {
      // Return success anyway to prevent email enumeration
      return { success: true };
    }

    // Generate a secure token
    const token = ID.unique();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store the token in patient record
    await databases.updateDocument(DATABASE_ID!, PATIENT_COLLECTION_ID!, patient.$id, {
      magicLinkToken: token,
      magicLinkExpiresAt: expiresAt.toISOString(),
    });

    // Send the magic link email
    const magicLink = `${BASE_URL}/portal/verify?token=${token}`;

    if (resend) {
      const { error } = await resend.emails.send({
        from: EMAIL_FROM,
        to: email,
        subject: "Autentificare Tandem Dent",
        html: createMagicLinkEmailHtml({
          patientName: patient.name,
          magicLink,
          expiresInMinutes: 15,
        }),
      });

      if (error) {
        console.error("Error sending magic link email:", error);
        throw error;
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending magic link:", error);
    throw error;
  }
}

/**
 * Verify magic link token and create session
 */
export async function verifyMagicLink(token: string) {
  try {
    // Find patient with this token
    const patients = await databases.listDocuments(DATABASE_ID!, PATIENT_COLLECTION_ID!, [
      Query.equal("magicLinkToken", token),
    ]);

    if (patients.documents.length === 0) {
      return { success: false, error: "Token invalid" };
    }

    const patient = patients.documents[0] as unknown as Patient;

    // Check if token is expired
    const expiresAt = new Date(patient.magicLinkExpiresAt!);
    if (expiresAt < new Date()) {
      return { success: false, error: "Token expirat" };
    }

    // Clear the token
    await databases.updateDocument(DATABASE_ID!, PATIENT_COLLECTION_ID!, patient.$id, {
      magicLinkToken: null,
      magicLinkExpiresAt: null,
    });

    // Create session token
    const sessionToken = ID.unique();
    const sessionExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Store session token in patient record
    await databases.updateDocument(DATABASE_ID!, PATIENT_COLLECTION_ID!, patient.$id, {
      sessionToken,
      sessionExpiresAt: sessionExpiresAt.toISOString(),
    });

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: sessionExpiresAt,
      path: "/",
    });

    return { success: true, patientId: patient.$id };
  } catch (error) {
    console.error("Error verifying magic link:", error);
    return { success: false, error: "Eroare de verificare" };
  }
}

/**
 * Get current patient session
 */
export async function getPatientSession() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionToken) {
      return null;
    }

    // Find patient with this session token
    const patients = await databases.listDocuments(DATABASE_ID!, PATIENT_COLLECTION_ID!, [
      Query.equal("sessionToken", sessionToken),
    ]);

    if (patients.documents.length === 0) {
      return null;
    }

    const patient = patients.documents[0] as unknown as Patient;

    // Check if session is expired
    const expiresAt = new Date(patient.sessionExpiresAt!);
    if (expiresAt < new Date()) {
      // Clear expired session
      await logoutPatient();
      return null;
    }

    return {
      $id: patient.$id,
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
    };
  } catch (error) {
    console.error("Error getting patient session:", error);
    return null;
  }
}

/**
 * Logout patient and clear session
 */
export async function logoutPatient() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (sessionToken) {
      // Find and clear patient session
      const patients = await databases.listDocuments(DATABASE_ID!, PATIENT_COLLECTION_ID!, [
        Query.equal("sessionToken", sessionToken),
      ]);

      if (patients.documents.length > 0) {
        await databases.updateDocument(
          DATABASE_ID!,
          PATIENT_COLLECTION_ID!,
          patients.documents[0].$id,
          {
            sessionToken: null,
            sessionExpiresAt: null,
          }
        );
      }
    }

    // Clear cookie
    cookieStore.delete(SESSION_COOKIE_NAME);

    return { success: true };
  } catch (error) {
    console.error("Error logging out patient:", error);
    throw error;
  }
}

/**
 * Get patient's appointments
 */
export async function getPatientAppointments(patientId: string) {
  try {
    const appointments = await databases.listDocuments(DATABASE_ID!, APPOINTMENT_COLLECTION_ID!, [
      Query.equal("patient", patientId),
      Query.orderDesc("schedule"),
    ]);

    return appointments.documents;
  } catch (error) {
    console.error("Error getting patient appointments:", error);
    return [];
  }
}

// ===========================================
// Doctor Authentication (Magic Link)
// ===========================================

const createDoctorMagicLinkEmailHtml = (data: {
  doctorName: string;
  magicLink: string;
  expiresInMinutes: number;
}) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #d4af37, #b8860b); padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #d4af37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .warning { color: #666; font-size: 14px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Autentificare Medic - Tandem Dent</h1>
    </div>
    <div class="content">
      <p>Dragă Dr. ${data.doctorName},</p>
      <p>Ați solicitat accesul la panoul medicilor Tandem Dent.</p>
      <p>Apăsați butonul de mai jos pentru a vă autentifica:</p>
      <a href="${data.magicLink}" class="button">Accesează Panoul</a>
      <p class="warning">Acest link expiră în ${data.expiresInMinutes} minute.</p>
      <p class="warning">Dacă nu ați solicitat acest email, vă rugăm să ne contactați imediat.</p>
    </div>
    <div class="footer">
      <p>Tandem Dent - ${BASE_URL}</p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Find doctor by email
 */
export async function getDoctorByEmail(email: string): Promise<Doctor | null> {
  try {
    if (!DOCTOR_COLLECTION_ID) {
      console.error("DOCTOR_COLLECTION_ID not configured");
      return null;
    }

    const doctors = await databases.listDocuments(DATABASE_ID!, DOCTOR_COLLECTION_ID, [
      Query.equal("email", email),
    ]);

    return (doctors.documents[0] as unknown as Doctor) || null;
  } catch (error) {
    console.error("Error finding doctor by email:", error);
    return null;
  }
}

/**
 * Generate and send magic link to doctor email
 */
export async function sendDoctorMagicLink(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!DOCTOR_COLLECTION_ID) {
      return { success: false, error: "Configurație incompletă" };
    }

    // First, check if doctor exists
    const doctor = await getDoctorByEmail(email);

    if (!doctor) {
      // Return success anyway to prevent email enumeration
      return { success: true };
    }

    // Generate a secure token
    const token = ID.unique();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store the token in doctor record
    await databases.updateDocument(DATABASE_ID!, DOCTOR_COLLECTION_ID, doctor.$id, {
      magicLinkToken: token,
      magicLinkExpiresAt: expiresAt.toISOString(),
    });

    // Send the magic link email
    const magicLink = `${BASE_URL}/auth/doctor/verify?token=${token}`;

    if (resend) {
      const { error } = await resend.emails.send({
        from: EMAIL_FROM,
        to: email,
        subject: "Autentificare Medic - Tandem Dent",
        html: createDoctorMagicLinkEmailHtml({
          doctorName: doctor.name,
          magicLink,
          expiresInMinutes: 15,
        }),
      });

      if (error) {
        console.error("Error sending doctor magic link email:", error);
        return { success: false, error: "Eroare la trimiterea emailului" };
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending doctor magic link:", error);
    return { success: false, error: "Eroare la trimiterea link-ului" };
  }
}

/**
 * Verify doctor magic link token and create session
 */
export async function verifyDoctorMagicLink(token: string): Promise<{ success: boolean; doctorId?: string; error?: string }> {
  try {
    if (!DOCTOR_COLLECTION_ID) {
      return { success: false, error: "Configurație incompletă" };
    }

    // Find doctor with this token
    const doctors = await databases.listDocuments(DATABASE_ID!, DOCTOR_COLLECTION_ID, [
      Query.equal("magicLinkToken", token),
    ]);

    if (doctors.documents.length === 0) {
      return { success: false, error: "Token invalid" };
    }

    const doctor = doctors.documents[0] as unknown as Doctor;

    // Check if token is expired
    const expiresAt = new Date(doctor.magicLinkExpiresAt!);
    if (expiresAt < new Date()) {
      return { success: false, error: "Token expirat" };
    }

    // Clear the token
    await databases.updateDocument(DATABASE_ID!, DOCTOR_COLLECTION_ID, doctor.$id, {
      magicLinkToken: null,
      magicLinkExpiresAt: null,
    });

    // Create session token
    const sessionToken = ID.unique();
    const sessionExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Store session token in doctor record
    await databases.updateDocument(DATABASE_ID!, DOCTOR_COLLECTION_ID, doctor.$id, {
      sessionToken,
      sessionExpiresAt: sessionExpiresAt.toISOString(),
    });

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set(DOCTOR_SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: sessionExpiresAt,
      path: "/",
    });

    return { success: true, doctorId: doctor.$id };
  } catch (error) {
    console.error("Error verifying doctor magic link:", error);
    return { success: false, error: "Eroare de verificare" };
  }
}

/**
 * Get current doctor session
 */
export async function getDoctorSession(): Promise<Doctor | null> {
  try {
    if (!DOCTOR_COLLECTION_ID) {
      return null;
    }

    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(DOCTOR_SESSION_COOKIE_NAME)?.value;

    if (!sessionToken) {
      return null;
    }

    // Find doctor with this session token
    const doctors = await databases.listDocuments(DATABASE_ID!, DOCTOR_COLLECTION_ID, [
      Query.equal("sessionToken", sessionToken),
    ]);

    if (doctors.documents.length === 0) {
      return null;
    }

    const doctor = doctors.documents[0] as unknown as Doctor;

    // Check if session is expired
    if (doctor.sessionExpiresAt) {
      const expiresAt = new Date(doctor.sessionExpiresAt);
      if (expiresAt < new Date()) {
        // Clear expired session
        await logoutDoctor();
        return null;
      }
    }

    return doctor;
  } catch (error) {
    console.error("Error getting doctor session:", error);
    return null;
  }
}

/**
 * Logout doctor and clear session
 */
export async function logoutDoctor(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(DOCTOR_SESSION_COOKIE_NAME)?.value;

    if (sessionToken && DOCTOR_COLLECTION_ID) {
      // Find and clear doctor session
      const doctors = await databases.listDocuments(DATABASE_ID!, DOCTOR_COLLECTION_ID, [
        Query.equal("sessionToken", sessionToken),
      ]);

      if (doctors.documents.length > 0) {
        await databases.updateDocument(
          DATABASE_ID!,
          DOCTOR_COLLECTION_ID,
          doctors.documents[0].$id,
          {
            sessionToken: null,
            sessionExpiresAt: null,
          }
        );
      }
    }

    // Clear cookie
    cookieStore.delete(DOCTOR_SESSION_COOKIE_NAME);

    return { success: true };
  } catch (error) {
    console.error("Error logging out doctor:", error);
    return { success: false };
  }
}

/**
 * Check if email belongs to admin or doctor
 */
export async function checkUserTypeByEmail(email: string): Promise<{ type: UserRole | "patient" | null; exists: boolean; hasPassword: boolean }> {
  try {
    // Check if it's an admin
    if (ADMIN_COLLECTION_ID) {
      const admins = await databases.listDocuments(DATABASE_ID!, ADMIN_COLLECTION_ID, [
        Query.equal("email", email),
      ]);
      if (admins.documents.length > 0) {
        const admin = admins.documents[0] as unknown as Admin;
        const hasPassword = !!(admin as any).passwordHash;
        return { type: "admin", exists: true, hasPassword };
      }
    }

    // Check if it's a doctor
    if (DOCTOR_COLLECTION_ID) {
      const doctors = await databases.listDocuments(DATABASE_ID!, DOCTOR_COLLECTION_ID, [
        Query.equal("email", email),
      ]);
      if (doctors.documents.length > 0) {
        const doctor = doctors.documents[0] as unknown as Doctor;
        const hasPassword = !!(doctor as any).passwordHash;
        return { type: "doctor", exists: true, hasPassword };
      }
    }

    // Check if it's a patient
    if (PATIENT_COLLECTION_ID) {
      const patients = await databases.listDocuments(DATABASE_ID!, PATIENT_COLLECTION_ID, [
        Query.equal("email", email),
      ]);
      if (patients.documents.length > 0) {
        const patient = patients.documents[0] as unknown as Patient;
        const hasPassword = !!(patient as any).passwordHash;
        return { type: "patient", exists: true, hasPassword };
      }
    }

    return { type: null, exists: false, hasPassword: false };
  } catch (error) {
    console.error("Error checking user type:", error);
    return { type: null, exists: false, hasPassword: false };
  }
}

// ===========================================
// Password-Based Authentication
// ===========================================

/**
 * Get client IP and user agent from request headers
 */
async function getClientInfo(): Promise<{ ip: string; userAgent: string }> {
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "unknown";
  const userAgent = headersList.get("user-agent") || "unknown";
  return { ip, userAgent };
}

/**
 * OTP Email Template for new device verification
 */
const createOTPEmailHtml = (data: {
  userName: string;
  otpCode: string;
  deviceInfo: string;
}) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #d4af37, #b8860b); padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .otp-code { font-size: 32px; font-weight: bold; color: #d4af37; letter-spacing: 4px; text-align: center; padding: 20px; background: white; border-radius: 8px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .warning { color: #666; font-size: 14px; margin-top: 20px; }
    .device-info { background: #fff3cd; padding: 10px; border-radius: 4px; margin: 15px 0; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Verificare Dispozitiv Nou</h1>
    </div>
    <div class="content">
      <p>Dragă ${data.userName},</p>
      <p>Am detectat o încercare de autentificare de pe un dispozitiv nou:</p>
      <div class="device-info">${data.deviceInfo}</div>
      <p>Introduceți codul de mai jos pentru a confirma că sunteți dvs.:</p>
      <div class="otp-code">${data.otpCode}</div>
      <p class="warning">Acest cod expiră în 10 minute.</p>
      <p class="warning">Dacă nu ați încercat să vă autentificați, vă rugăm să vă schimbați parola imediat.</p>
    </div>
    <div class="footer">
      <p>Tandem Dent - ${BASE_URL}</p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Register a new admin with email and password
 */
export async function registerAdmin(data: RegisterAdminParams): Promise<RegistrationResult> {
  try {
    if (!ADMIN_COLLECTION_ID) {
      return { success: false, requiresOTP: false, error: "Configurație incompletă" };
    }

    // Validate password
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.valid) {
      return { success: false, requiresOTP: false, error: passwordValidation.errors[0] };
    }

    // Check if email already exists
    const existingAdmin = await databases.listDocuments(DATABASE_ID!, ADMIN_COLLECTION_ID, [
      Query.equal("email", data.email),
    ]);

    if (existingAdmin.documents.length > 0) {
      return { success: false, requiresOTP: false, error: "Această adresă de email este deja înregistrată" };
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);

    // Get client info for device fingerprint
    const { ip, userAgent } = await getClientInfo();
    const deviceId = generateDeviceId(userAgent, ip);

    // Create initial device
    const devices = addOrUpdateDevice([], deviceId, userAgent, ip);

    // Create admin in Appwrite
    const newAdmin = await databases.createDocument(
      DATABASE_ID!,
      ADMIN_COLLECTION_ID,
      ID.unique(),
      {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        passwordHash,
        devices: stringifyDevices(devices),
      }
    );

    // Create Appwrite Auth user for OTP
    let appwriteUserId: string;
    try {
      const existingUsers = await users.list([Query.equal("email", data.email)]);
      if (existingUsers.users.length > 0) {
        appwriteUserId = existingUsers.users[0].$id;
      } else {
        const newUser = await users.create(
          ID.unique(),
          data.email,
          undefined,
          undefined,
          data.name
        );
        appwriteUserId = newUser.$id;
      }

      // Update admin with Appwrite user ID
      await databases.updateDocument(DATABASE_ID!, ADMIN_COLLECTION_ID, newAdmin.$id, {
        appwriteAuthId: appwriteUserId,
      });

      // Send OTP for email verification
      await account.createEmailToken(appwriteUserId, data.email);

      return {
        success: true,
        requiresOTP: true,
        userId: newAdmin.$id,
        userType: "admin",
      };
    } catch (e) {
      console.error("Error creating Appwrite auth user:", e);
      // Admin was created, but OTP failed - they can still login
      return {
        success: true,
        requiresOTP: true,
        userId: newAdmin.$id,
        userType: "admin",
        error: "Cont creat, dar verificarea email-ului a eșuat. Încercați să vă autentificați.",
      };
    }
  } catch (error) {
    console.error("Error registering admin:", error);
    return { success: false, requiresOTP: false, error: "Eroare la înregistrare" };
  }
}

/**
 * Register a new doctor with email and password
 */
export async function registerDoctor(data: RegisterDoctorParams): Promise<RegistrationResult> {
  try {
    if (!DOCTOR_COLLECTION_ID) {
      return { success: false, requiresOTP: false, error: "Configurație incompletă" };
    }

    // Validate password
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.valid) {
      return { success: false, requiresOTP: false, error: passwordValidation.errors[0] };
    }

    // Check if email already exists
    const existingDoctor = await databases.listDocuments(DATABASE_ID!, DOCTOR_COLLECTION_ID, [
      Query.equal("email", data.email),
    ]);

    if (existingDoctor.documents.length > 0) {
      return { success: false, requiresOTP: false, error: "Această adresă de email este deja înregistrată" };
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);

    // Get client info for device fingerprint
    const { ip, userAgent } = await getClientInfo();
    const deviceId = generateDeviceId(userAgent, ip);

    // Create initial device
    const devices = addOrUpdateDevice([], deviceId, userAgent, ip);

    // Create doctor in Appwrite
    const newDoctor = await databases.createDocument(
      DATABASE_ID!,
      DOCTOR_COLLECTION_ID,
      ID.unique(),
      {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        specialty: data.specialty || null,
        passwordHash,
        devices: stringifyDevices(devices),
        googleCalendarConnected: false,
      }
    );

    // Create Appwrite Auth user for OTP
    let appwriteUserId: string;
    try {
      const existingUsers = await users.list([Query.equal("email", data.email)]);
      if (existingUsers.users.length > 0) {
        appwriteUserId = existingUsers.users[0].$id;
      } else {
        const newUser = await users.create(
          ID.unique(),
          data.email,
          undefined,
          undefined,
          data.name
        );
        appwriteUserId = newUser.$id;
      }

      // Update doctor with Appwrite user ID
      await databases.updateDocument(DATABASE_ID!, DOCTOR_COLLECTION_ID, newDoctor.$id, {
        appwriteAuthId: appwriteUserId,
      });

      // Send OTP for email verification
      await account.createEmailToken(appwriteUserId, data.email);

      return {
        success: true,
        requiresOTP: true,
        userId: newDoctor.$id,
        userType: "doctor",
      };
    } catch (e) {
      console.error("Error creating Appwrite auth user:", e);
      return {
        success: true,
        requiresOTP: true,
        userId: newDoctor.$id,
        userType: "doctor",
        error: "Cont creat, dar verificarea email-ului a eșuat. Încercați să vă autentificați.",
      };
    }
  } catch (error) {
    console.error("Error registering doctor:", error);
    return { success: false, requiresOTP: false, error: "Eroare la înregistrare" };
  }
}

/**
 * Register a new patient with email and password
 */
export async function registerPatientWithPassword(data: RegisterPatientParams): Promise<RegistrationResult> {
  try {
    if (!PATIENT_COLLECTION_ID) {
      return { success: false, requiresOTP: false, error: "Configurație incompletă" };
    }

    // Validate password
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.valid) {
      return { success: false, requiresOTP: false, error: passwordValidation.errors[0] };
    }

    // Check if email already exists
    const existingPatient = await databases.listDocuments(DATABASE_ID!, PATIENT_COLLECTION_ID, [
      Query.equal("email", data.email),
    ]);

    if (existingPatient.documents.length > 0) {
      return { success: false, requiresOTP: false, error: "Această adresă de email este deja înregistrată" };
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);

    // Get client info for device fingerprint
    const { ip, userAgent } = await getClientInfo();
    const deviceId = generateDeviceId(userAgent, ip);

    // Create initial device
    const devices = addOrUpdateDevice([], deviceId, userAgent, ip);

    // Create patient in Appwrite
    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID,
      ID.unique(),
      {
        userId: ID.unique(), // Legacy field
        name: data.name,
        email: data.email,
        phone: data.phone,
        birthDate: data.birthDate.toISOString(),
        gender: data.gender,
        address: data.address,
        occupation: data.occupation,
        emergencyContactName: data.emergencyContactName,
        emergencyContactNumber: data.emergencyContactNumber,
        primaryPhysician: data.primaryPhysician || null,
        insuranceProvider: data.insuranceProvider || null,
        insurancePolicyNumber: data.insurancePolicyNumber || null,
        allergies: data.allergies || null,
        currentMedication: data.currentMedication || null,
        familyMedicalHistory: data.familyMedicalHistory || null,
        pastMedicalHistory: data.pastMedicalHistory || null,
        privacyConsent: data.privacyConsent,
        passwordHash,
        devices: stringifyDevices(devices),
      }
    );

    // Create Appwrite Auth user for OTP
    let appwriteUserId: string;
    try {
      const existingUsers = await users.list([Query.equal("email", data.email)]);
      if (existingUsers.users.length > 0) {
        appwriteUserId = existingUsers.users[0].$id;
      } else {
        const newUser = await users.create(
          ID.unique(),
          data.email,
          undefined,
          undefined,
          data.name
        );
        appwriteUserId = newUser.$id;
      }

      // Update patient with Appwrite user ID
      await databases.updateDocument(DATABASE_ID!, PATIENT_COLLECTION_ID, newPatient.$id, {
        appwriteAuthId: appwriteUserId,
      });

      // Send OTP for email verification
      await account.createEmailToken(appwriteUserId, data.email);

      return {
        success: true,
        requiresOTP: true,
        userId: newPatient.$id,
        userType: "patient",
      };
    } catch (e) {
      console.error("Error creating Appwrite auth user:", e);
      return {
        success: true,
        requiresOTP: true,
        userId: newPatient.$id,
        userType: "patient",
        error: "Cont creat, dar verificarea email-ului a eșuat. Încercați să vă autentificați.",
      };
    }
  } catch (error) {
    console.error("Error registering patient:", error);
    return { success: false, requiresOTP: false, error: "Eroare la înregistrare" };
  }
}

/**
 * Login with email and password
 * Returns requiresOTP: true if this is a new device
 */
export async function loginWithPassword(
  email: string,
  password: string
): Promise<LoginResult> {
  try {
    // Get client info
    const { ip, userAgent } = await getClientInfo();
    const deviceId = generateDeviceId(userAgent, ip);

    // Check user type and find user
    const userCheck = await checkUserTypeByEmail(email);

    if (!userCheck.exists || !userCheck.type) {
      // Generic error to prevent email enumeration
      return { success: false, requiresOTP: false, error: "Email sau parolă incorectă" };
    }

    let user: Admin | Doctor | Patient | null = null;
    let collectionId: string | undefined;
    let sessionCookieName: string;

    // Find user based on type
    switch (userCheck.type) {
      case "admin":
        collectionId = ADMIN_COLLECTION_ID;
        sessionCookieName = ADMIN_SESSION_COOKIE_NAME;
        const admins = await databases.listDocuments(DATABASE_ID!, collectionId!, [
          Query.equal("email", email),
        ]);
        user = admins.documents[0] as unknown as Admin;
        break;

      case "doctor":
        collectionId = DOCTOR_COLLECTION_ID;
        sessionCookieName = DOCTOR_SESSION_COOKIE_NAME;
        const doctors = await databases.listDocuments(DATABASE_ID!, collectionId!, [
          Query.equal("email", email),
        ]);
        user = doctors.documents[0] as unknown as Doctor;
        break;

      case "patient":
        collectionId = PATIENT_COLLECTION_ID;
        sessionCookieName = SESSION_COOKIE_NAME;
        const patients = await databases.listDocuments(DATABASE_ID!, collectionId!, [
          Query.equal("email", email),
        ]);
        user = patients.documents[0] as unknown as Patient;
        break;

      default:
        return { success: false, requiresOTP: false, error: "Email sau parolă incorectă" };
    }

    if (!user || !collectionId) {
      return { success: false, requiresOTP: false, error: "Email sau parolă incorectă" };
    }

    // Check if user has a password set
    const passwordHash = (user as any).passwordHash;
    if (!passwordHash) {
      return {
        success: false,
        requiresOTP: false,
        error: "Acest cont nu are o parolă setată. Folosiți link-ul magic pentru autentificare.",
      };
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, passwordHash);
    if (!isValidPassword) {
      return { success: false, requiresOTP: false, error: "Email sau parolă incorectă" };
    }

    // Check if device is known
    const devices = parseDevices((user as any).devices);
    const isKnown = isKnownDevice(devices, deviceId);

    if (!isKnown) {
      // New device - require OTP
      const appwriteUserId = (user as any).appwriteAuthId;

      if (appwriteUserId) {
        try {
          // Send OTP via Appwrite
          await account.createEmailToken(appwriteUserId, email);
        } catch (e) {
          // If Appwrite OTP fails, send via Resend
          console.error("Appwrite OTP failed, trying Resend:", e);

          if (resend) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

            // Store OTP temporarily
            await databases.updateDocument(DATABASE_ID!, collectionId, user.$id, {
              magicLinkToken: otp,
              magicLinkExpiresAt: otpExpiry.toISOString(),
            });

            await resend.emails.send({
              from: EMAIL_FROM,
              to: email,
              subject: "Cod de verificare - Tandem Dent",
              html: createOTPEmailHtml({
                userName: user.name,
                otpCode: otp,
                deviceInfo: `${userAgent} (IP: ${ip})`,
              }),
            });
          }
        }
      }

      return {
        success: true,
        requiresOTP: true,
        userId: user.$id,
        userType: userCheck.type as UserRole,
      };
    }

    // Known device - create session directly
    const sessionToken = ID.unique();
    const sessionExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Update last used time for device
    const updatedDevices = addOrUpdateDevice(devices, deviceId, userAgent, ip);

    await databases.updateDocument(DATABASE_ID!, collectionId, user.$id, {
      sessionToken,
      sessionExpiresAt: sessionExpiresAt.toISOString(),
      devices: stringifyDevices(updatedDevices),
    });

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set(sessionCookieName!, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: sessionExpiresAt,
      path: "/",
    });

    return {
      success: true,
      requiresOTP: false,
      userId: user.$id,
      userType: userCheck.type as UserRole,
    };
  } catch (error) {
    console.error("Error logging in with password:", error);
    return { success: false, requiresOTP: false, error: "Eroare la autentificare" };
  }
}

/**
 * Verify OTP and complete login for new device
 */
export async function verifyOTPAndLogin(
  userId: string,
  userType: UserRole,
  otp: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { ip, userAgent } = await getClientInfo();
    const deviceId = generateDeviceId(userAgent, ip);

    let collectionId: string | undefined;
    let sessionCookieName: string;

    switch (userType) {
      case "admin":
        collectionId = ADMIN_COLLECTION_ID;
        sessionCookieName = ADMIN_SESSION_COOKIE_NAME;
        break;
      case "doctor":
        collectionId = DOCTOR_COLLECTION_ID;
        sessionCookieName = DOCTOR_SESSION_COOKIE_NAME;
        break;
      case "patient":
        collectionId = PATIENT_COLLECTION_ID;
        sessionCookieName = SESSION_COOKIE_NAME;
        break;
      default:
        return { success: false, error: "Tip de utilizator invalid" };
    }

    if (!collectionId) {
      return { success: false, error: "Configurație incompletă" };
    }

    // Get user
    const user = await databases.getDocument(DATABASE_ID!, collectionId, userId);
    const appwriteUserId = (user as any).appwriteAuthId;

    // Try to verify with Appwrite first
    let otpVerified = false;

    if (appwriteUserId) {
      try {
        await account.createSession(appwriteUserId, otp);
        otpVerified = true;
      } catch (e) {
        console.error("Appwrite OTP verification failed:", e);
      }
    }

    // If Appwrite verification failed, try our stored OTP
    if (!otpVerified) {
      const storedOtp = (user as any).magicLinkToken;
      const otpExpiry = (user as any).magicLinkExpiresAt;

      if (storedOtp && storedOtp === otp) {
        if (otpExpiry && new Date(otpExpiry) > new Date()) {
          otpVerified = true;
          // Clear stored OTP
          await databases.updateDocument(DATABASE_ID!, collectionId, userId, {
            magicLinkToken: null,
            magicLinkExpiresAt: null,
          });
        } else {
          return { success: false, error: "Codul OTP a expirat" };
        }
      }
    }

    if (!otpVerified) {
      return { success: false, error: "Cod OTP invalid" };
    }

    // OTP verified - add device and create session
    const devices = parseDevices((user as any).devices);
    const updatedDevices = addOrUpdateDevice(devices, deviceId, userAgent, ip);

    const sessionToken = ID.unique();
    const sessionExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await databases.updateDocument(DATABASE_ID!, collectionId, userId, {
      sessionToken,
      sessionExpiresAt: sessionExpiresAt.toISOString(),
      devices: stringifyDevices(updatedDevices),
    });

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set(sessionCookieName, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: sessionExpiresAt,
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { success: false, error: "Eroare la verificare" };
  }
}

/**
 * Verify registration OTP (email verification)
 */
export async function verifyRegistrationOTP(
  userId: string,
  userType: UserRole,
  otp: string
): Promise<{ success: boolean; error?: string }> {
  // Registration OTP verification is the same as login OTP
  return verifyOTPAndLogin(userId, userType, otp);
}

/**
 * Get user's known devices
 */
export async function getKnownDevices(
  userId: string,
  userType: UserRole
): Promise<DeviceFingerprint[]> {
  try {
    let collectionId: string | undefined;

    switch (userType) {
      case "admin":
        collectionId = ADMIN_COLLECTION_ID;
        break;
      case "doctor":
        collectionId = DOCTOR_COLLECTION_ID;
        break;
      case "patient":
        collectionId = PATIENT_COLLECTION_ID;
        break;
      default:
        return [];
    }

    if (!collectionId) return [];

    const user = await databases.getDocument(DATABASE_ID!, collectionId, userId);
    return parseDevices((user as any).devices);
  } catch (error) {
    console.error("Error getting known devices:", error);
    return [];
  }
}

/**
 * Remove a device from user's known devices
 */
export async function removeUserDevice(
  userId: string,
  userType: UserRole,
  deviceId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    let collectionId: string | undefined;

    switch (userType) {
      case "admin":
        collectionId = ADMIN_COLLECTION_ID;
        break;
      case "doctor":
        collectionId = DOCTOR_COLLECTION_ID;
        break;
      case "patient":
        collectionId = PATIENT_COLLECTION_ID;
        break;
      default:
        return { success: false, error: "Tip de utilizator invalid" };
    }

    if (!collectionId) {
      return { success: false, error: "Configurație incompletă" };
    }

    const user = await databases.getDocument(DATABASE_ID!, collectionId, userId);
    const devices = parseDevices((user as any).devices);
    const updatedDevices = removeDeviceFromList(devices, deviceId);

    await databases.updateDocument(DATABASE_ID!, collectionId, userId, {
      devices: stringifyDevices(updatedDevices),
    });

    return { success: true };
  } catch (error) {
    console.error("Error removing device:", error);
    return { success: false, error: "Eroare la ștergerea dispozitivului" };
  }
}

/**
 * Set password for existing user (who doesn't have one)
 */
export async function setUserPassword(
  userId: string,
  userType: UserRole,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return { success: false, error: passwordValidation.errors[0] };
    }

    let collectionId: string | undefined;

    switch (userType) {
      case "admin":
        collectionId = ADMIN_COLLECTION_ID;
        break;
      case "doctor":
        collectionId = DOCTOR_COLLECTION_ID;
        break;
      case "patient":
        collectionId = PATIENT_COLLECTION_ID;
        break;
      default:
        return { success: false, error: "Tip de utilizator invalid" };
    }

    if (!collectionId) {
      return { success: false, error: "Configurație incompletă" };
    }

    const passwordHash = await hashPassword(newPassword);

    await databases.updateDocument(DATABASE_ID!, collectionId, userId, {
      passwordHash,
    });

    return { success: true };
  } catch (error) {
    console.error("Error setting password:", error);
    return { success: false, error: "Eroare la setarea parolei" };
  }
}

/**
 * Resend OTP for device verification
 */
export async function resendOTP(
  userId: string,
  userType: UserRole
): Promise<{ success: boolean; error?: string }> {
  try {
    let collectionId: string | undefined;

    switch (userType) {
      case "admin":
        collectionId = ADMIN_COLLECTION_ID;
        break;
      case "doctor":
        collectionId = DOCTOR_COLLECTION_ID;
        break;
      case "patient":
        collectionId = PATIENT_COLLECTION_ID;
        break;
      default:
        return { success: false, error: "Tip de utilizator invalid" };
    }

    if (!collectionId) {
      return { success: false, error: "Configurație incompletă" };
    }

    const user = await databases.getDocument(DATABASE_ID!, collectionId, userId);
    const email = (user as any).email;
    const appwriteUserId = (user as any).appwriteAuthId;

    if (appwriteUserId) {
      try {
        await account.createEmailToken(appwriteUserId, email);
        return { success: true };
      } catch (e) {
        console.error("Appwrite OTP resend failed:", e);
      }
    }

    // Fallback to Resend
    if (resend) {
      const { ip, userAgent } = await getClientInfo();
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      await databases.updateDocument(DATABASE_ID!, collectionId, userId, {
        magicLinkToken: otp,
        magicLinkExpiresAt: otpExpiry.toISOString(),
      });

      await resend.emails.send({
        from: EMAIL_FROM,
        to: email,
        subject: "Cod de verificare - Tandem Dent",
        html: createOTPEmailHtml({
          userName: (user as any).name,
          otpCode: otp,
          deviceInfo: `${userAgent} (IP: ${ip})`,
        }),
      });

      return { success: true };
    }

    return { success: false, error: "Nu s-a putut trimite codul OTP" };
  } catch (error) {
    console.error("Error resending OTP:", error);
    return { success: false, error: "Eroare la retrimiterea codului" };
  }
}
