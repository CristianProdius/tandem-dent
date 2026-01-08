"use server";

import { google } from "googleapis";

import {
  databases,
  DATABASE_ID,
  DOCTOR_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
} from "@/lib/appwrite/appwrite.config";
import { oauth2Client } from "@/lib/google/google.config";
import type { Appointment } from "@/types/appwrite.types";

import { getAppointment } from "./appointment.actions";
import { getDoctorByName } from "./doctor.actions";

/**
 * Create a Google Calendar event for an appointment
 */
export async function createCalendarEvent(appointmentId: string) {
  try {
    const appointmentDoc = await getAppointment(appointmentId);
    if (!appointmentDoc) {
      throw new Error("Appointment not found");
    }
    const appointment = appointmentDoc as unknown as Appointment;

    const doctor = await getDoctorByName(appointment.primaryPhysician);
    if (!doctor || !doctor.googleCalendarConnected || !doctor.googleRefreshToken) {
      console.log("Doctor not connected to Google Calendar");
      return { success: false, reason: "Doctor not connected" };
    }

    // Set credentials
    oauth2Client.setCredentials({
      refresh_token: doctor.googleRefreshToken,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const startTime = new Date(appointment.schedule);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour default

    const event = {
      summary: `Programare: ${appointment.patient.name}`,
      description: `Pacient: ${appointment.patient.name}\nTelefon: ${appointment.patient.phone}\nMotiv: ${appointment.reason}\n\nCreat de Tandem Dent`,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: "Europe/Chisinau",
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: "Europe/Chisinau",
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email" as const, minutes: 24 * 60 },
          { method: "popup" as const, minutes: 60 },
        ],
      },
    };

    const calendarId = doctor.googleCalendarId || "primary";

    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
    });

    // Store the event ID in the appointment
    await databases.updateDocument(DATABASE_ID!, APPOINTMENT_COLLECTION_ID!, appointmentId, {
      googleCalendarEventId: response.data.id,
    });

    console.log(`Created Google Calendar event: ${response.data.id}`);
    return { success: true, eventId: response.data.id };
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Error creating calendar event:", error);
    return { success: false, error: err.message };
  }
}

/**
 * Update a Google Calendar event for an appointment
 */
export async function updateCalendarEvent(appointmentId: string) {
  try {
    const appointmentDoc = await getAppointment(appointmentId);
    if (!appointmentDoc) {
      console.log("No calendar event to update");
      return { success: false, reason: "No event to update" };
    }
    const appointment = appointmentDoc as unknown as Appointment;
    if (!appointment.googleCalendarEventId) {
      console.log("No calendar event to update");
      return { success: false, reason: "No event to update" };
    }

    const doctor = await getDoctorByName(appointment.primaryPhysician);
    if (!doctor || !doctor.googleCalendarConnected || !doctor.googleRefreshToken) {
      console.log("Doctor not connected to Google Calendar");
      return { success: false, reason: "Doctor not connected" };
    }

    // Set credentials
    oauth2Client.setCredentials({
      refresh_token: doctor.googleRefreshToken,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const startTime = new Date(appointment.schedule);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

    const event = {
      summary: `Programare: ${appointment.patient.name}`,
      description: `Pacient: ${appointment.patient.name}\nTelefon: ${appointment.patient.phone}\nMotiv: ${appointment.reason}\n\nCreat de Tandem Dent`,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: "Europe/Chisinau",
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: "Europe/Chisinau",
      },
    };

    const calendarId = doctor.googleCalendarId || "primary";

    await calendar.events.update({
      calendarId,
      eventId: appointment.googleCalendarEventId,
      requestBody: event,
    });

    console.log(`Updated Google Calendar event: ${appointment.googleCalendarEventId}`);
    return { success: true };
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Error updating calendar event:", error);
    return { success: false, error: err.message };
  }
}

/**
 * Delete a Google Calendar event for an appointment
 */
export async function deleteCalendarEvent(appointmentId: string) {
  try {
    const appointmentDoc = await getAppointment(appointmentId);
    if (!appointmentDoc) {
      console.log("No calendar event to delete");
      return { success: false, reason: "No event to delete" };
    }
    const appointment = appointmentDoc as unknown as Appointment;
    if (!appointment.googleCalendarEventId) {
      console.log("No calendar event to delete");
      return { success: false, reason: "No event to delete" };
    }

    const doctor = await getDoctorByName(appointment.primaryPhysician);
    if (!doctor || !doctor.googleCalendarConnected || !doctor.googleRefreshToken) {
      console.log("Doctor not connected to Google Calendar");
      return { success: false, reason: "Doctor not connected" };
    }

    // Set credentials
    oauth2Client.setCredentials({
      refresh_token: doctor.googleRefreshToken,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const calendarId = doctor.googleCalendarId || "primary";

    await calendar.events.delete({
      calendarId,
      eventId: appointment.googleCalendarEventId,
    });

    // Clear the event ID from the appointment
    await databases.updateDocument(DATABASE_ID!, APPOINTMENT_COLLECTION_ID!, appointmentId, {
      googleCalendarEventId: null,
    });

    console.log(`Deleted Google Calendar event: ${appointment.googleCalendarEventId}`);
    return { success: true };
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Error deleting calendar event:", error);
    return { success: false, error: err.message };
  }
}

/**
 * Store Google Calendar tokens for a doctor
 */
export async function storeGoogleTokens(
  doctorId: string,
  refreshToken: string,
  _accessToken?: string
) {
  try {
    await databases.updateDocument(DATABASE_ID!, DOCTOR_COLLECTION_ID!, doctorId, {
      googleCalendarConnected: true,
      googleRefreshToken: refreshToken,
    });

    return { success: true };
  } catch (error: unknown) {
    console.error("Error storing Google tokens:", error);
    throw error;
  }
}

/**
 * Disconnect Google Calendar for a doctor
 */
export async function disconnectGoogleCalendarAction(doctorId: string) {
  try {
    await databases.updateDocument(DATABASE_ID!, DOCTOR_COLLECTION_ID!, doctorId, {
      googleCalendarConnected: false,
      googleRefreshToken: null,
      googleCalendarId: null,
    });

    return { success: true };
  } catch (error: unknown) {
    console.error("Error disconnecting Google Calendar:", error);
    throw error;
  }
}
