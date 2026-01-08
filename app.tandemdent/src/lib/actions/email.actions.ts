"use server";

import { resend, EMAIL_FROM } from "@/lib/resend/resend.config";
import { formatDateTime } from "@/lib/utils";
import type { Appointment } from "@/types/appwrite.types";

import { getAppointment } from "./appointment.actions";
import { getDoctorByName } from "./doctor.actions";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://tandemdent.md";

// Simple text email templates (React Email templates can be added later)
const createConfirmationEmailHtml = (data: {
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
}) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #d4af37, #b8860b); padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .detail-row { padding: 10px 0; border-bottom: 1px solid #eee; }
    .detail-row:last-child { border-bottom: none; }
    .label { font-weight: bold; color: #666; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Confirmare Programare</h1>
    </div>
    <div class="content">
      <p>Dragă ${data.patientName},</p>
      <p>Programarea dumneavoastră a fost confirmată cu succes.</p>
      <div class="details">
        <div class="detail-row"><span class="label">Data:</span> ${data.appointmentDate}</div>
        <div class="detail-row"><span class="label">Ora:</span> ${data.appointmentTime}</div>
        <div class="detail-row"><span class="label">Doctor:</span> ${data.doctorName}</div>
        <div class="detail-row"><span class="label">Serviciu:</span> ${data.reason}</div>
      </div>
      <p>Vă așteptăm la Tandem Dent!</p>
    </div>
    <div class="footer">
      <p>Tandem Dent - ${BASE_URL}</p>
    </div>
  </div>
</body>
</html>
`;

const createReminderEmailHtml = (data: {
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
}) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #14b8a6, #0d9488); padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .detail-row { padding: 10px 0; border-bottom: 1px solid #eee; }
    .detail-row:last-child { border-bottom: none; }
    .label { font-weight: bold; color: #666; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Reminder Programare</h1>
    </div>
    <div class="content">
      <p>Dragă ${data.patientName},</p>
      <p>Vă reamintim că aveți o programare mâine.</p>
      <div class="details">
        <div class="detail-row"><span class="label">Data:</span> ${data.appointmentDate}</div>
        <div class="detail-row"><span class="label">Ora:</span> ${data.appointmentTime}</div>
        <div class="detail-row"><span class="label">Doctor:</span> ${data.doctorName}</div>
        <div class="detail-row"><span class="label">Serviciu:</span> ${data.reason}</div>
      </div>
      <p>Vă așteptăm!</p>
    </div>
    <div class="footer">
      <p>Tandem Dent - ${BASE_URL}</p>
    </div>
  </div>
</body>
</html>
`;

const createCancellationEmailHtml = (data: {
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  cancellationReason?: string;
}) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #ef4444, #dc2626); padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .detail-row { padding: 10px 0; border-bottom: 1px solid #eee; }
    .detail-row:last-child { border-bottom: none; }
    .label { font-weight: bold; color: #666; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Programare Anulată</h1>
    </div>
    <div class="content">
      <p>Dragă ${data.patientName},</p>
      <p>Din păcate, programarea dumneavoastră a fost anulată.</p>
      <div class="details">
        <div class="detail-row"><span class="label">Data:</span> ${data.appointmentDate}</div>
        <div class="detail-row"><span class="label">Ora:</span> ${data.appointmentTime}</div>
        <div class="detail-row"><span class="label">Doctor:</span> ${data.doctorName}</div>
        ${data.cancellationReason ? `<div class="detail-row"><span class="label">Motiv:</span> ${data.cancellationReason}</div>` : ""}
      </div>
      <p>Pentru o nouă programare, vă rugăm să ne contactați.</p>
    </div>
    <div class="footer">
      <p>Tandem Dent - ${BASE_URL}</p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Send appointment confirmation email to patient
 */
export async function sendConfirmationEmail(appointmentId: string) {
  try {
    if (!resend) {
      console.log("Resend not configured, skipping email");
      return { success: false, reason: "Email not configured" };
    }

    const appointmentDoc = await getAppointment(appointmentId);
    if (!appointmentDoc) {
      throw new Error("Appointment not found");
    }
    const appointment = appointmentDoc as unknown as Appointment;

    const patient = appointment.patient;
    const doctor = await getDoctorByName(appointment.primaryPhysician);
    const { dateOnly, timeOnly } = formatDateTime(appointment.schedule);

    // Send to patient
    const { data: patientEmail, error: patientError } = await resend.emails.send({
      from: EMAIL_FROM,
      to: patient.email,
      subject: `Confirmare programare - ${dateOnly}`,
      html: createConfirmationEmailHtml({
        patientName: patient.name,
        doctorName: appointment.primaryPhysician,
        appointmentDate: dateOnly,
        appointmentTime: timeOnly,
        reason: appointment.reason,
      }),
    });

    if (patientError) {
      console.error("Error sending patient confirmation email:", patientError);
      throw patientError;
    }

    // Send to doctor if email exists
    if (doctor?.email) {
      const { error: doctorError } = await resend.emails.send({
        from: EMAIL_FROM,
        to: doctor.email,
        subject: `Programare nouă: ${patient.name} - ${dateOnly}`,
        html: createConfirmationEmailHtml({
          patientName: patient.name,
          doctorName: appointment.primaryPhysician,
          appointmentDate: dateOnly,
          appointmentTime: timeOnly,
          reason: appointment.reason,
        }),
      });

      if (doctorError) {
        console.error("Error sending doctor confirmation email:", doctorError);
      }
    }

    return { success: true, messageId: patientEmail?.id };
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    throw error;
  }
}

/**
 * Send appointment reminder email to patient
 */
export async function sendReminderEmail(appointmentId: string) {
  try {
    if (!resend) {
      console.log("Resend not configured, skipping email");
      return { success: false, reason: "Email not configured" };
    }

    const appointmentDoc = await getAppointment(appointmentId);
    if (!appointmentDoc) {
      throw new Error("Appointment not found");
    }
    const appointment = appointmentDoc as unknown as Appointment;

    const patient = appointment.patient;
    const doctor = await getDoctorByName(appointment.primaryPhysician);
    const { dateOnly, timeOnly } = formatDateTime(appointment.schedule);

    // Send to patient
    const { data: patientEmail, error: patientError } = await resend.emails.send({
      from: EMAIL_FROM,
      to: patient.email,
      subject: `Reminder: Programare mâine - ${timeOnly}`,
      html: createReminderEmailHtml({
        patientName: patient.name,
        doctorName: appointment.primaryPhysician,
        appointmentDate: dateOnly,
        appointmentTime: timeOnly,
        reason: appointment.reason,
      }),
    });

    if (patientError) {
      console.error("Error sending patient reminder email:", patientError);
      throw patientError;
    }

    // Send to doctor if email exists
    if (doctor?.email) {
      const { error: doctorError } = await resend.emails.send({
        from: EMAIL_FROM,
        to: doctor.email,
        subject: `Reminder: ${patient.name} mâine - ${timeOnly}`,
        html: createReminderEmailHtml({
          patientName: patient.name,
          doctorName: appointment.primaryPhysician,
          appointmentDate: dateOnly,
          appointmentTime: timeOnly,
          reason: appointment.reason,
        }),
      });

      if (doctorError) {
        console.error("Error sending doctor reminder email:", doctorError);
      }
    }

    return { success: true, messageId: patientEmail?.id };
  } catch (error) {
    console.error("Error sending reminder email:", error);
    throw error;
  }
}

/**
 * Send appointment cancellation email to patient
 */
export async function sendCancellationEmail(appointmentId: string, cancellationReason?: string) {
  try {
    if (!resend) {
      console.log("Resend not configured, skipping email");
      return { success: false, reason: "Email not configured" };
    }

    const appointmentDoc = await getAppointment(appointmentId);
    if (!appointmentDoc) {
      throw new Error("Appointment not found");
    }
    const appointment = appointmentDoc as unknown as Appointment;

    const patient = appointment.patient;
    const doctor = await getDoctorByName(appointment.primaryPhysician);
    const { dateOnly, timeOnly } = formatDateTime(appointment.schedule);

    // Send to patient
    const { data: patientEmail, error: patientError } = await resend.emails.send({
      from: EMAIL_FROM,
      to: patient.email,
      subject: `Programare anulată - ${dateOnly}`,
      html: createCancellationEmailHtml({
        patientName: patient.name,
        doctorName: appointment.primaryPhysician,
        appointmentDate: dateOnly,
        appointmentTime: timeOnly,
        cancellationReason,
      }),
    });

    if (patientError) {
      console.error("Error sending patient cancellation email:", patientError);
      throw patientError;
    }

    // Send to doctor if email exists
    if (doctor?.email) {
      const { error: doctorError } = await resend.emails.send({
        from: EMAIL_FROM,
        to: doctor.email,
        subject: `Programare anulată: ${patient.name} - ${dateOnly}`,
        html: createCancellationEmailHtml({
          patientName: patient.name,
          doctorName: appointment.primaryPhysician,
          appointmentDate: dateOnly,
          appointmentTime: timeOnly,
          cancellationReason,
        }),
      });

      if (doctorError) {
        console.error("Error sending doctor cancellation email:", doctorError);
      }
    }

    return { success: true, messageId: patientEmail?.id };
  } catch (error) {
    console.error("Error sending cancellation email:", error);
    throw error;
  }
}
