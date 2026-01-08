import { NextRequest, NextResponse } from "next/server";

import { getAppointment } from "@/lib/actions/appointment.actions";
import type { Appointment } from "@/types/appwrite.types";
import {
  createAppointmentDetails,
  generateICSContent,
} from "@/lib/utils/calendar-links";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ appointmentId: string }> }
) {
  try {
    const { appointmentId } = await params;

    // Get appointment details
    const appointmentDoc = await getAppointment(appointmentId);
    if (!appointmentDoc) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    const appointment = appointmentDoc as unknown as Appointment;

    // Create appointment details for ICS
    const appointmentDetails = createAppointmentDetails(
      appointmentId,
      appointment.patient?.name || "Patient",
      appointment.primaryPhysician,
      new Date(appointment.schedule),
      appointment.reason
    );

    // Generate ICS content
    const icsContent = generateICSContent(appointmentDetails);

    // Return ICS file
    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="tandemdent-appointment-${appointmentId}.ics"`,
      },
    });
  } catch (error) {
    console.error("Error generating ICS file:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
