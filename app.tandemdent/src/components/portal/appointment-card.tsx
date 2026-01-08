"use client";

import { Calendar, Clock, FileText, Stethoscope } from "lucide-react";

import { StatusBadge } from "@/components/dental/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatDateTime } from "@/lib/utils";

interface AppointmentCardProps {
  appointment: {
    $id: string;
    schedule: string;
    primaryPhysician: string;
    reason: string;
    status: "scheduled" | "pending" | "cancelled";
    note?: string;
    cancellationReason?: string;
  };
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  const { dateOnly, timeOnly } = formatDateTime(appointment.schedule);
  const isPast = new Date(appointment.schedule) < new Date();

  return (
    <Card
      className={cn(
        isPast && appointment.status === "scheduled" && "opacity-75"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Status Row */}
            <div className="mb-3 flex items-center gap-2">
              <StatusBadge status={appointment.status} />
              {isPast && appointment.status === "scheduled" && (
                <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  Past
                </span>
              )}
            </div>

            {/* Doctor Name */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                <Stethoscope className="size-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">
                Dr. {appointment.primaryPhysician}
              </h3>
            </div>

            {/* Appointment Details */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="size-4" />
                <span className="font-medium">Date:</span> {dateOnly}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="size-4" />
                <span className="font-medium">Time:</span> {timeOnly}
              </div>
              <div className="flex items-start gap-2 text-muted-foreground">
                <FileText className="size-4 mt-0.5" />
                <span>
                  <span className="font-medium">Reason:</span> {appointment.reason}
                </span>
              </div>
            </div>

            {/* Note */}
            {appointment.note && (
              <div className="mt-4 rounded-lg bg-primary/10 p-3 border border-primary/20">
                <p className="text-sm">
                  <span className="font-medium">Note:</span> {appointment.note}
                </p>
              </div>
            )}

            {/* Cancellation Reason */}
            {appointment.cancellationReason && (
              <div className="mt-4 rounded-lg bg-destructive/10 p-3 border border-destructive/20">
                <p className="text-sm text-destructive">
                  <span className="font-medium">Cancellation reason:</span>{" "}
                  {appointment.cancellationReason}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
