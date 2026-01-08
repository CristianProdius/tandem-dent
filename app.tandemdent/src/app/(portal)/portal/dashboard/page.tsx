import { Phone } from "lucide-react";
import { redirect } from "next/navigation";

import { AppointmentList } from "@/components/portal/appointment-list";
import { PortalLayout } from "@/components/portal/portal-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getPatientSession,
  getPatientAppointments,
} from "@/lib/actions/auth.actions";

export default async function DashboardPage() {
  const session = await getPatientSession();

  if (!session) {
    redirect("/portal");
  }

  const appointments = await getPatientAppointments(session.$id);

  return (
    <PortalLayout patientName={session.name}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">
            My Appointments
          </h1>
          <p className="text-muted-foreground">
            View all your appointments at TandemDent.
          </p>
        </div>

        <AppointmentList appointments={appointments as unknown as Parameters<typeof AppointmentList>[0]["appointments"]} />

        <Card>
          <CardHeader>
            <CardTitle>Want to schedule an appointment?</CardTitle>
            <CardDescription>
              To schedule a visit, please contact us by phone.
              Our team will help you find a convenient time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a
              href="tel:+12345678900"
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Phone className="mr-2 size-5" />
              +1 234 567 8900
            </a>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
