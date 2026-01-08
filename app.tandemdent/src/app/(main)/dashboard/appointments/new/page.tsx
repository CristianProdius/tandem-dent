import { getDoctors } from "@/lib/actions/doctor.actions";
import { getPatients } from "@/lib/actions/patient.actions";
import { getServices } from "@/lib/actions/service.actions";
import type { Doctor, Patient, Service } from "@/types/appwrite.types";

import { NewAppointmentForm } from "./_components/new-appointment-form";

export default async function NewAppointmentPage() {
  const [doctorsData, patientsData, servicesData] = await Promise.all([
    getDoctors(),
    getPatients(1, 100),
    getServices(),
  ]);

  return (
    <div className="@container/main flex flex-col gap-6">
      <div>
        <h1 className="font-semibold text-2xl">Programare nouă</h1>
        <p className="text-muted-foreground">Programați o nouă consultație pentru un pacient.</p>
      </div>

      <NewAppointmentForm
        doctors={(doctorsData?.documents || []) as Doctor[]}
        patients={(patientsData?.patients || []) as Patient[]}
        services={(servicesData?.documents || []) as Service[]}
      />
    </div>
  );
}
