"use client";

import { Calendar } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { AppointmentCard } from "./appointment-card";

interface Appointment {
  $id: string;
  schedule: string;
  primaryPhysician: string;
  reason: string;
  status: "scheduled" | "pending" | "cancelled";
  note?: string;
  cancellationReason?: string;
}

interface AppointmentListProps {
  appointments: Appointment[];
}

export function AppointmentList({ appointments }: AppointmentListProps) {
  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
            <Calendar className="size-8 text-muted-foreground" />
          </div>
          <h3 className="mb-1 text-lg font-medium">
            No Appointments
          </h3>
          <p className="text-muted-foreground">
            To schedule an appointment, please call us at +1 234 567 8900.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Separate upcoming and past appointments
  const now = new Date();
  const upcoming = appointments.filter(
    (a) => new Date(a.schedule) >= now && a.status !== "cancelled"
  );
  const past = appointments.filter(
    (a) => new Date(a.schedule) < now || a.status === "cancelled"
  );

  return (
    <div className="space-y-8">
      {upcoming.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold">
            Upcoming Appointments
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((appointment) => (
              <AppointmentCard key={appointment.$id} appointment={appointment} />
            ))}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold">
            Appointment History
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((appointment) => (
              <AppointmentCard key={appointment.$id} appointment={appointment} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
