import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";
import { getPatients } from "@/lib/actions/patient.actions";
import type { Appointment } from "@/types/appwrite.types";

import { AppointmentsChart } from "./_components/appointments-chart";
import { RecentAppointmentsTable } from "./_components/recent-appointments-table";
import { SectionCards } from "./_components/section-cards";

export default async function ClinicDashboardPage() {
  // Fetch data server-side
  const appointmentData = await getRecentAppointmentList();
  const patientData = await getPatients(1, 10);

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <SectionCards
        scheduledCount={appointmentData?.scheduledCount || 0}
        pendingCount={appointmentData?.pendingCount || 0}
        cancelledCount={appointmentData?.cancelledCount || 0}
        totalPatients={patientData?.total || 0}
      />
      <AppointmentsChart />
      <RecentAppointmentsTable appointments={(appointmentData?.documents as Appointment[]) || []} />
    </div>
  );
}
