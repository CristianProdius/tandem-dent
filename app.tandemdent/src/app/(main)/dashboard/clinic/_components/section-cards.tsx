"use client";

import { Calendar, CircleCheck, Clock, Users, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SectionCardsProps {
  scheduledCount: number;
  pendingCount: number;
  cancelledCount: number;
  totalPatients: number;
}

export function SectionCards({
  scheduledCount,
  pendingCount,
  cancelledCount,
  totalPatients,
}: SectionCardsProps) {
  const totalAppointments = scheduledCount + pendingCount + cancelledCount;
  const appointmentsToday = scheduledCount; // In production, filter by today's date

  return (
    <div className="grid @5xl/main:grid-cols-4 @xl/main:grid-cols-2 grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <Calendar className="size-4" />
            Programări azi
          </CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
            {appointmentsToday}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-emerald-600">
              <CircleCheck className="size-3" />
              Programat
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {scheduledCount} programări confirmate
          </div>
          <div className="text-muted-foreground">Gata pentru pacienții de azi</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <Clock className="size-4" />
            Programări în așteptare
          </CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
            {pendingCount}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-amber-600">
              <Clock className="size-3" />
              În așteptare
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Așteaptă confirmare
          </div>
          <div className="text-muted-foreground">Necesită acțiune administrator</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <Users className="size-4" />
            Total pacienți
          </CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
            {totalPatients}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-blue-600">
              <Users className="size-3" />
              Activ
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Pacienți înregistrați
          </div>
          <div className="text-muted-foreground">În sistem</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <XCircle className="size-4" />
            Anulate
          </CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
            {cancelledCount}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-red-600">
              <XCircle className="size-3" />
              Anulat
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Programări anulate
          </div>
          <div className="text-muted-foreground">Urmărește rata de anulare</div>
        </CardFooter>
      </Card>
    </div>
  );
}
