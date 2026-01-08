import { notFound } from "next/navigation";

import { getPatientById } from "@/lib/actions/patient.actions";
import { getTreatmentsByPatient } from "@/lib/actions/treatment.actions";
import { getAllAppointments } from "@/lib/actions/appointment.actions";
import { getDoctors } from "@/lib/actions/doctor.actions";
import type { Patient, Treatment, Appointment, Doctor } from "@/types/appwrite.types";

import { PatientDetailView } from "./_components/patient-detail-view";

interface PatientDetailPageProps {
  params: Promise<{ patientId: string }>;
}

export default async function PatientDetailPage({ params }: PatientDetailPageProps) {
  const { patientId } = await params;

  const [patient, treatments, appointmentsData, doctorsData] = await Promise.all([
    getPatientById(patientId),
    getTreatmentsByPatient(patientId),
    getAllAppointments({ patientId, limit: 50 }),
    getDoctors(),
  ]);

  if (!patient) {
    notFound();
  }

  return (
    <PatientDetailView
      patient={patient as Patient}
      treatments={(treatments || []) as Treatment[]}
      appointments={(appointmentsData?.appointments || []) as Appointment[]}
      doctors={(doctorsData?.documents || []) as Doctor[]}
    />
  );
}
