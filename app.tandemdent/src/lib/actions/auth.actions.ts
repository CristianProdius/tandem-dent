"use server";

import { cookies, headers } from "next/headers";
import { ID, Query } from "node-appwrite";

import {
  databases,
  account,
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
  DOCTOR_COLLECTION_ID,
  ADMIN_COLLECTION_ID,
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
  generateResetToken,
  hashResetToken,
  verifyResetToken,
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
// Admin Authentication (OTP via Appwrite)
// ===========================================

/**
 * Send OTP to admin email using Appwrite
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

    // Send OTP via Appwrite
    const otpResult = await sendAppwriteOTP(email);
    if (!otpResult.success) {
      return { success: false, error: otpResult.error };
    }

    // Store Appwrite userId for session creation
    await databases.updateDocument(DATABASE_ID!, ADMIN_COLLECTION_ID, admin.$id, {
      appwriteOtpUserId: otpResult.userId,
    });

    return {
      success: true,
      adminId: admin.$id,
      userId: otpResult.userId,
    };
  } catch (error) {
    console.error("Error sending admin OTP:", error);
    return { success: false, error: "Eroare la trimiterea codului" };
  }
}

/**
 * Verify admin OTP and create session
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
    const appwriteUserId = userId || (admin as any).appwriteOtpUserId;

    if (!appwriteUserId) {
      return { success: false, error: "Sesiune OTP invalidă" };
    }

    // Verify OTP via Appwrite - creates session
    try {
      await account.createSession(appwriteUserId, otp);
    } catch (error: any) {
      if (error.code === 401) {
        return { success: false, error: "Cod OTP invalid sau expirat" };
      }
      throw error;
    }

    // OTP verified - create our session
    const sessionToken = ID.unique();
    const sessionExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Clear OTP userId and store session token
    await databases.updateDocument(DATABASE_ID!, ADMIN_COLLECTION_ID, admin.$id, {
      appwriteOtpUserId: null,
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
 * Send OTP via Appwrite (uses configured SMTP provider - Resend)
 */
async function sendAppwriteOTP(email: string): Promise<{
  success: boolean;
  userId?: string;
  error?: string;
}> {
  try {
    const result = await account.createEmailToken(
      ID.unique(),
      email
    );
    return { success: true, userId: result.userId };
  } catch (error) {
    console.error("Error sending Appwrite OTP:", error);
    return { success: false, error: "Eroare la trimiterea codului OTP" };
  }
}

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

    // Send OTP for email verification via Appwrite
    const otpResult = await sendAppwriteOTP(data.email);

    if (!otpResult.success) {
      // Admin was created, but OTP failed - they can still login
      return {
        success: true,
        requiresOTP: true,
        userId: newAdmin.$id,
        userType: "admin",
        error: "Cont creat, dar verificarea email-ului a eșuat. Încercați să vă autentificați.",
      };
    }

    // Store Appwrite userId for session creation
    await databases.updateDocument(DATABASE_ID!, ADMIN_COLLECTION_ID, newAdmin.$id, {
      appwriteOtpUserId: otpResult.userId,
    });

    return {
      success: true,
      requiresOTP: true,
      userId: newAdmin.$id,
      userType: "admin",
    };
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

    // Send OTP for email verification via Appwrite
    const otpResult = await sendAppwriteOTP(data.email);

    if (!otpResult.success) {
      return {
        success: true,
        requiresOTP: true,
        userId: newDoctor.$id,
        userType: "doctor",
        error: "Cont creat, dar verificarea email-ului a eșuat. Încercați să vă autentificați.",
      };
    }

    // Store Appwrite userId for session creation
    await databases.updateDocument(DATABASE_ID!, DOCTOR_COLLECTION_ID, newDoctor.$id, {
      appwriteOtpUserId: otpResult.userId,
    });

    return {
      success: true,
      requiresOTP: true,
      userId: newDoctor.$id,
      userType: "doctor",
    };
  } catch (error) {
    console.error("Error registering doctor:", error);
    return { success: false, requiresOTP: false, error: "Eroare la înregistrare" };
  }
}

/**
 * Create a doctor from admin dashboard (with optional password)
 * This is for admin use - does not require OTP verification
 */
export async function createDoctorWithPassword(data: {
  name: string;
  email: string;
  phone?: string;
  specialty?: string;
  password?: string;
}): Promise<{ success: boolean; doctorId?: string; error?: string }> {
  try {
    if (!DOCTOR_COLLECTION_ID) {
      return { success: false, error: "Configurație incompletă" };
    }

    // Check if email already exists
    const existingDoctor = await databases.listDocuments(DATABASE_ID!, DOCTOR_COLLECTION_ID, [
      Query.equal("email", data.email),
    ]);

    if (existingDoctor.documents.length > 0) {
      return { success: false, error: "Această adresă de email este deja înregistrată" };
    }

    // Hash password if provided
    let passwordHash: string | undefined;
    if (data.password) {
      const passwordValidation = validatePassword(data.password);
      if (!passwordValidation.valid) {
        return { success: false, error: passwordValidation.errors[0] };
      }
      passwordHash = await hashPassword(data.password);
    }

    // Create doctor in Appwrite database
    const newDoctor = await databases.createDocument(
      DATABASE_ID!,
      DOCTOR_COLLECTION_ID,
      ID.unique(),
      {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        specialty: data.specialty || null,
        passwordHash: passwordHash || null,
        googleCalendarConnected: false,
      }
    );

    return { success: true, doctorId: newDoctor.$id };
  } catch (error) {
    console.error("Error creating doctor:", error);
    return { success: false, error: "Eroare la crearea medicului" };
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

    // Send OTP for email verification via Appwrite
    const otpResult = await sendAppwriteOTP(data.email);

    if (!otpResult.success) {
      return {
        success: true,
        requiresOTP: true,
        userId: newPatient.$id,
        userType: "patient",
        error: "Cont creat, dar verificarea email-ului a eșuat. Încercați să vă autentificați.",
      };
    }

    // Store Appwrite userId for session creation
    await databases.updateDocument(DATABASE_ID!, PATIENT_COLLECTION_ID, newPatient.$id, {
      appwriteOtpUserId: otpResult.userId,
    });

    return {
      success: true,
      requiresOTP: true,
      userId: newPatient.$id,
      userType: "patient",
    };
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
      // New device - require OTP via Appwrite
      const otpResult = await sendAppwriteOTP(email);

      if (!otpResult.success) {
        return { success: false, requiresOTP: false, error: otpResult.error || "Eroare la trimiterea OTP" };
      }

      // Store Appwrite userId for verification
      await databases.updateDocument(DATABASE_ID!, collectionId, user.$id, {
        appwriteOtpUserId: otpResult.userId,
      });

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
    const appwriteUserId = (user as any).appwriteOtpUserId;

    if (!appwriteUserId) {
      return { success: false, error: "Sesiune OTP invalidă" };
    }

    // Verify OTP via Appwrite
    try {
      await account.createSession(appwriteUserId, otp);
    } catch (error: any) {
      if (error.code === 401) {
        return { success: false, error: "Cod OTP invalid sau expirat" };
      }
      throw error;
    }

    // OTP verified - add device and create session
    const devices = parseDevices((user as any).devices);
    const updatedDevices = addOrUpdateDevice(devices, deviceId, userAgent, ip);

    const sessionToken = ID.unique();
    const sessionExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Clear OTP userId and update session
    await databases.updateDocument(DATABASE_ID!, collectionId, userId, {
      appwriteOtpUserId: null,
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

    // Send new OTP via Appwrite
    const otpResult = await sendAppwriteOTP(email);
    if (!otpResult.success) {
      return { success: false, error: otpResult.error };
    }

    // Update stored Appwrite userId
    await databases.updateDocument(DATABASE_ID!, collectionId, userId, {
      appwriteOtpUserId: otpResult.userId,
    });

    return { success: true };
  } catch (error) {
    console.error("Error resending OTP:", error);
    return { success: false, error: "Eroare la retrimiterea codului" };
  }
}

// ===========================================
// Password Reset Flow
// ===========================================

/**
 * Password Reset Email Template
 */
const createPasswordResetEmailHtml = (data: {
  userName: string;
  resetLink: string;
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
      <h1>Resetare Parolă</h1>
    </div>
    <div class="content">
      <p>Dragă ${data.userName},</p>
      <p>Am primit o cerere de resetare a parolei pentru contul dvs. Tandem Dent.</p>
      <p>Apăsați butonul de mai jos pentru a vă seta o parolă nouă:</p>
      <a href="${data.resetLink}" class="button">Resetează Parola</a>
      <p class="warning">Acest link expiră în ${data.expiresInMinutes} minute.</p>
      <p class="warning">Dacă nu ați solicitat resetarea parolei, puteți ignora acest email. Parola dvs. actuală va rămâne neschimbată.</p>
    </div>
    <div class="footer">
      <p>Tandem Dent - ${BASE_URL}</p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Request password reset - sends email with reset link
 * Returns success even if email doesn't exist (to prevent enumeration)
 */
export async function requestPasswordReset(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Find user by email (check all collections)
    let user: Admin | Doctor | Patient | null = null;
    let collectionId: string | undefined;
    let userType: string | null = null;

    // Check admin
    if (ADMIN_COLLECTION_ID) {
      const admins = await databases.listDocuments(DATABASE_ID!, ADMIN_COLLECTION_ID, [
        Query.equal("email", email),
      ]);
      if (admins.documents.length > 0) {
        user = admins.documents[0] as unknown as Admin;
        collectionId = ADMIN_COLLECTION_ID;
        userType = "admin";
      }
    }

    // Check doctor
    if (!user && DOCTOR_COLLECTION_ID) {
      const doctors = await databases.listDocuments(DATABASE_ID!, DOCTOR_COLLECTION_ID, [
        Query.equal("email", email),
      ]);
      if (doctors.documents.length > 0) {
        user = doctors.documents[0] as unknown as Doctor;
        collectionId = DOCTOR_COLLECTION_ID;
        userType = "doctor";
      }
    }

    // Check patient
    if (!user && PATIENT_COLLECTION_ID) {
      const patients = await databases.listDocuments(DATABASE_ID!, PATIENT_COLLECTION_ID, [
        Query.equal("email", email),
      ]);
      if (patients.documents.length > 0) {
        user = patients.documents[0] as unknown as Patient;
        collectionId = PATIENT_COLLECTION_ID;
        userType = "patient";
      }
    }

    // Return success even if user not found (prevent enumeration)
    if (!user || !collectionId || !userType) {
      return { success: true };
    }

    // Generate reset token
    const token = generateResetToken();
    const tokenHash = hashResetToken(token);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store hashed token in user document
    await databases.updateDocument(DATABASE_ID!, collectionId, user.$id, {
      resetToken: tokenHash,
      resetTokenExpiry: expiresAt.toISOString(),
    });

    // Build reset link with token and email
    const resetLink = `${BASE_URL}/auth/v2/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    // Send email
    if (resend) {
      const { error } = await resend.emails.send({
        from: EMAIL_FROM,
        to: email,
        subject: "Resetare Parolă - Tandem Dent",
        html: createPasswordResetEmailHtml({
          userName: user.name,
          resetLink,
          expiresInMinutes: 60,
        }),
      });

      if (error) {
        console.error("Error sending password reset email:", error);
        return { success: false, error: "Eroare la trimiterea emailului" };
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error requesting password reset:", error);
    return { success: false, error: "Eroare la procesarea cererii" };
  }
}

/**
 * Reset password using token from email link
 */
export async function resetPassword(
  token: string,
  email: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return { success: false, error: passwordValidation.errors[0] };
    }

    // Find user by email (check all collections)
    let user: Admin | Doctor | Patient | null = null;
    let collectionId: string | undefined;

    // Check admin
    if (ADMIN_COLLECTION_ID) {
      const admins = await databases.listDocuments(DATABASE_ID!, ADMIN_COLLECTION_ID, [
        Query.equal("email", email),
      ]);
      if (admins.documents.length > 0) {
        user = admins.documents[0] as unknown as Admin;
        collectionId = ADMIN_COLLECTION_ID;
      }
    }

    // Check doctor
    if (!user && DOCTOR_COLLECTION_ID) {
      const doctors = await databases.listDocuments(DATABASE_ID!, DOCTOR_COLLECTION_ID, [
        Query.equal("email", email),
      ]);
      if (doctors.documents.length > 0) {
        user = doctors.documents[0] as unknown as Doctor;
        collectionId = DOCTOR_COLLECTION_ID;
      }
    }

    // Check patient
    if (!user && PATIENT_COLLECTION_ID) {
      const patients = await databases.listDocuments(DATABASE_ID!, PATIENT_COLLECTION_ID, [
        Query.equal("email", email),
      ]);
      if (patients.documents.length > 0) {
        user = patients.documents[0] as unknown as Patient;
        collectionId = PATIENT_COLLECTION_ID;
      }
    }

    if (!user || !collectionId) {
      return { success: false, error: "Link de resetare invalid sau expirat" };
    }

    // Get stored token hash and expiry
    const storedTokenHash = (user as any).resetToken;
    const tokenExpiry = (user as any).resetTokenExpiry;

    if (!storedTokenHash || !tokenExpiry) {
      return { success: false, error: "Link de resetare invalid sau expirat" };
    }

    // Check if token is expired
    if (new Date(tokenExpiry) < new Date()) {
      // Clear expired token
      await databases.updateDocument(DATABASE_ID!, collectionId, user.$id, {
        resetToken: null,
        resetTokenExpiry: null,
      });
      return { success: false, error: "Link de resetare expirat. Vă rugăm solicitați unul nou." };
    }

    // Verify token
    if (!verifyResetToken(token, storedTokenHash)) {
      return { success: false, error: "Link de resetare invalid" };
    }

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    // Update password and clear reset token
    await databases.updateDocument(DATABASE_ID!, collectionId, user.$id, {
      passwordHash,
      resetToken: null,
      resetTokenExpiry: null,
      // Optionally clear all devices to force re-login everywhere
      // devices: null,
    });

    return { success: true };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { success: false, error: "Eroare la resetarea parolei" };
  }
}

/**
 * Validate reset token without using it
 * Used to check if token is valid before showing reset form
 */
export async function validateResetToken(
  token: string,
  email: string
): Promise<{ valid: boolean; error?: string }> {
  try {
    // Find user by email
    let user: Admin | Doctor | Patient | null = null;
    let collectionId: string | undefined;

    if (ADMIN_COLLECTION_ID) {
      const admins = await databases.listDocuments(DATABASE_ID!, ADMIN_COLLECTION_ID, [
        Query.equal("email", email),
      ]);
      if (admins.documents.length > 0) {
        user = admins.documents[0] as unknown as Admin;
        collectionId = ADMIN_COLLECTION_ID;
      }
    }

    if (!user && DOCTOR_COLLECTION_ID) {
      const doctors = await databases.listDocuments(DATABASE_ID!, DOCTOR_COLLECTION_ID, [
        Query.equal("email", email),
      ]);
      if (doctors.documents.length > 0) {
        user = doctors.documents[0] as unknown as Doctor;
        collectionId = DOCTOR_COLLECTION_ID;
      }
    }

    if (!user && PATIENT_COLLECTION_ID) {
      const patients = await databases.listDocuments(DATABASE_ID!, PATIENT_COLLECTION_ID, [
        Query.equal("email", email),
      ]);
      if (patients.documents.length > 0) {
        user = patients.documents[0] as unknown as Patient;
        collectionId = PATIENT_COLLECTION_ID;
      }
    }

    if (!user) {
      return { valid: false, error: "Link de resetare invalid" };
    }

    const storedTokenHash = (user as any).resetToken;
    const tokenExpiry = (user as any).resetTokenExpiry;

    if (!storedTokenHash || !tokenExpiry) {
      return { valid: false, error: "Link de resetare invalid sau expirat" };
    }

    if (new Date(tokenExpiry) < new Date()) {
      return { valid: false, error: "Link de resetare expirat" };
    }

    if (!verifyResetToken(token, storedTokenHash)) {
      return { valid: false, error: "Link de resetare invalid" };
    }

    return { valid: true };
  } catch (error) {
    console.error("Error validating reset token:", error);
    return { valid: false, error: "Eroare la validarea link-ului" };
  }
}

// ===========================================
// Admin Invitation System
// ===========================================

/**
 * Admin Invitation Email Template
 */
const createAdminInviteEmailHtml = (data: {
  adminName: string;
  inviterName: string;
  inviteLink: string;
  expiresInHours: number;
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
    .highlight { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Invitație Administrator</h1>
    </div>
    <div class="content">
      <p>Dragă ${data.adminName},</p>
      <p><strong>${data.inviterName}</strong> v-a invitat să vă alăturați echipei de administrare Tandem Dent.</p>
      <div class="highlight">
        <p><strong>Ce puteți face ca administrator:</strong></p>
        <ul>
          <li>Gestiona programările clinicii</li>
          <li>Administra medicii și pacienții</li>
          <li>Configura setările clinicii</li>
        </ul>
      </div>
      <p>Apăsați butonul de mai jos pentru a vă configura contul:</p>
      <a href="${data.inviteLink}" class="button">Acceptă Invitația</a>
      <p class="warning">Acest link expiră în ${data.expiresInHours} ore.</p>
      <p class="warning">Dacă nu vă așteptați la această invitație, puteți ignora acest email.</p>
    </div>
    <div class="footer">
      <p>Tandem Dent - ${BASE_URL}</p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Invite a new admin
 * Creates admin document with invite token and sends invitation email
 */
export async function inviteAdmin(data: {
  name: string;
  email: string;
  inviterName: string;
}): Promise<{ success: boolean; adminId?: string; error?: string }> {
  try {
    if (!ADMIN_COLLECTION_ID) {
      return { success: false, error: "Configurație incompletă" };
    }

    // Check if email already exists
    const existingAdmin = await databases.listDocuments(DATABASE_ID!, ADMIN_COLLECTION_ID, [
      Query.equal("email", data.email),
    ]);

    if (existingAdmin.documents.length > 0) {
      return { success: false, error: "Această adresă de email este deja înregistrată" };
    }

    // Also check doctors collection to prevent duplicate emails across roles
    if (DOCTOR_COLLECTION_ID) {
      const existingDoctor = await databases.listDocuments(DATABASE_ID!, DOCTOR_COLLECTION_ID, [
        Query.equal("email", data.email),
      ]);
      if (existingDoctor.documents.length > 0) {
        return { success: false, error: "Această adresă de email este deja folosită de un medic" };
      }
    }

    // Generate invite token
    const token = generateResetToken();
    const tokenHash = hashResetToken(token);
    const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000); // 72 hours (3 days)

    // Create admin document with pending status
    const newAdmin = await databases.createDocument(
      DATABASE_ID!,
      ADMIN_COLLECTION_ID,
      ID.unique(),
      {
        name: data.name,
        email: data.email,
        inviteToken: tokenHash,
        inviteTokenExpiry: expiresAt.toISOString(),
        inviteStatus: "pending",
      }
    );

    // Build invite link
    const inviteLink = `${BASE_URL}/auth/v2/accept-invite?token=${token}&email=${encodeURIComponent(data.email)}`;

    // Send invitation email
    if (resend) {
      const { error } = await resend.emails.send({
        from: EMAIL_FROM,
        to: data.email,
        subject: "Invitație Administrator - Tandem Dent",
        html: createAdminInviteEmailHtml({
          adminName: data.name,
          inviterName: data.inviterName,
          inviteLink,
          expiresInHours: 72,
        }),
      });

      if (error) {
        console.error("Error sending admin invite email:", error);
        // Delete the admin document since email failed
        await databases.deleteDocument(DATABASE_ID!, ADMIN_COLLECTION_ID, newAdmin.$id);
        return { success: false, error: "Eroare la trimiterea invitației pe email" };
      }
    }

    return { success: true, adminId: newAdmin.$id };
  } catch (error) {
    console.error("Error inviting admin:", error);
    return { success: false, error: "Eroare la crearea invitației" };
  }
}

/**
 * Validate admin invite token
 */
export async function validateAdminInvite(
  token: string,
  email: string
): Promise<{ valid: boolean; adminName?: string; error?: string }> {
  try {
    if (!ADMIN_COLLECTION_ID) {
      return { valid: false, error: "Configurație incompletă" };
    }

    // Find admin by email
    const admins = await databases.listDocuments(DATABASE_ID!, ADMIN_COLLECTION_ID, [
      Query.equal("email", email),
    ]);

    if (admins.documents.length === 0) {
      return { valid: false, error: "Invitație invalidă" };
    }

    const admin = admins.documents[0] as unknown as Admin;

    // Check invite status
    if ((admin as any).inviteStatus !== "pending") {
      return { valid: false, error: "Această invitație a fost deja folosită" };
    }

    // Get stored token hash and expiry
    const storedTokenHash = (admin as any).inviteToken;
    const tokenExpiry = (admin as any).inviteTokenExpiry;

    if (!storedTokenHash || !tokenExpiry) {
      return { valid: false, error: "Invitație invalidă sau expirată" };
    }

    // Check if token is expired
    if (new Date(tokenExpiry) < new Date()) {
      return { valid: false, error: "Invitația a expirat. Solicitați o nouă invitație." };
    }

    // Verify token
    if (!verifyResetToken(token, storedTokenHash)) {
      return { valid: false, error: "Invitație invalidă" };
    }

    return { valid: true, adminName: admin.name };
  } catch (error) {
    console.error("Error validating admin invite:", error);
    return { valid: false, error: "Eroare la validarea invitației" };
  }
}

/**
 * Accept admin invitation and set password
 */
export async function acceptAdminInvite(
  token: string,
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!ADMIN_COLLECTION_ID) {
      return { success: false, error: "Configurație incompletă" };
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return { success: false, error: passwordValidation.errors[0] };
    }

    // Find admin by email
    const admins = await databases.listDocuments(DATABASE_ID!, ADMIN_COLLECTION_ID, [
      Query.equal("email", email),
    ]);

    if (admins.documents.length === 0) {
      return { success: false, error: "Invitație invalidă" };
    }

    const admin = admins.documents[0] as unknown as Admin;

    // Check invite status
    if ((admin as any).inviteStatus !== "pending") {
      return { success: false, error: "Această invitație a fost deja folosită" };
    }

    // Get stored token hash and expiry
    const storedTokenHash = (admin as any).inviteToken;
    const tokenExpiry = (admin as any).inviteTokenExpiry;

    if (!storedTokenHash || !tokenExpiry) {
      return { success: false, error: "Invitație invalidă sau expirată" };
    }

    // Check if token is expired
    if (new Date(tokenExpiry) < new Date()) {
      return { success: false, error: "Invitația a expirat. Solicitați o nouă invitație." };
    }

    // Verify token
    if (!verifyResetToken(token, storedTokenHash)) {
      return { success: false, error: "Invitație invalidă" };
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Update admin document
    await databases.updateDocument(DATABASE_ID!, ADMIN_COLLECTION_ID, admin.$id, {
      passwordHash,
      inviteToken: null,
      inviteTokenExpiry: null,
      inviteStatus: "active",
    });

    return { success: true };
  } catch (error) {
    console.error("Error accepting admin invite:", error);
    return { success: false, error: "Eroare la activarea contului" };
  }
}

/**
 * Resend admin invitation
 */
export async function resendAdminInvite(
  adminId: string,
  inviterName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!ADMIN_COLLECTION_ID) {
      return { success: false, error: "Configurație incompletă" };
    }

    // Get admin document
    const admin = await databases.getDocument(DATABASE_ID!, ADMIN_COLLECTION_ID, adminId) as unknown as Admin;

    // Check if invite is still pending
    if ((admin as any).inviteStatus !== "pending") {
      return { success: false, error: "Această invitație a fost deja acceptată" };
    }

    // Generate new invite token
    const token = generateResetToken();
    const tokenHash = hashResetToken(token);
    const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000); // 72 hours

    // Update admin document with new token
    await databases.updateDocument(DATABASE_ID!, ADMIN_COLLECTION_ID, adminId, {
      inviteToken: tokenHash,
      inviteTokenExpiry: expiresAt.toISOString(),
    });

    // Build invite link
    const inviteLink = `${BASE_URL}/auth/v2/accept-invite?token=${token}&email=${encodeURIComponent(admin.email)}`;

    // Send invitation email
    if (resend) {
      const { error } = await resend.emails.send({
        from: EMAIL_FROM,
        to: admin.email,
        subject: "Invitație Administrator - Tandem Dent",
        html: createAdminInviteEmailHtml({
          adminName: admin.name,
          inviterName,
          inviteLink,
          expiresInHours: 72,
        }),
      });

      if (error) {
        console.error("Error resending admin invite email:", error);
        return { success: false, error: "Eroare la retrimiterea invitației" };
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error resending admin invite:", error);
    return { success: false, error: "Eroare la retrimiterea invitației" };
  }
}

/**
 * Delete pending admin invite
 */
export async function deleteAdminInvite(
  adminId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!ADMIN_COLLECTION_ID) {
      return { success: false, error: "Configurație incompletă" };
    }

    // Get admin document
    const admin = await databases.getDocument(DATABASE_ID!, ADMIN_COLLECTION_ID, adminId) as unknown as Admin;

    // Only allow deleting pending invites
    if ((admin as any).inviteStatus !== "pending") {
      return { success: false, error: "Doar invitațiile în așteptare pot fi șterse" };
    }

    // Delete admin document
    await databases.deleteDocument(DATABASE_ID!, ADMIN_COLLECTION_ID, adminId);

    return { success: true };
  } catch (error) {
    console.error("Error deleting admin invite:", error);
    return { success: false, error: "Eroare la ștergerea invitației" };
  }
}
