import { getAllAppointments, getRecentAppointmentList } from "@/lib/actions/appointment.actions";

import { AppointmentsStats } from "./_components/appointments-stats";
import { AppointmentsTable } from "./_components/appointments-table";

export default async function AppointmentsPage() {
  const [appointmentData, allAppointments] = await Promise.all([
    getRecentAppointmentList(),
    getAllAppointments({ limit: 50 }),
  ]);

  return (
    <div className="@container/main flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
        <p className="text-muted-foreground">Manage all patient appointments</p>
      </div>

      <AppointmentsStats
        scheduledCount={appointmentData?.scheduledCount || 0}
        pendingCount={appointmentData?.pendingCount || 0}
        cancelledCount={appointmentData?.cancelledCount || 0}
        totalCount={appointmentData?.totalCount || 0}
      />

      <AppointmentsTable appointments={allAppointments.appointments} />
    </div>
  );
}
