import { TrendingUp, Users, UserPlus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getPatients, getPatientStats } from "@/lib/actions/patient.actions";
import type { Patient } from "@/types/appwrite.types";

import { PatientsTable } from "./_components/patients-table";

export default async function PatientsPage() {
  const [patientData, stats] = await Promise.all([
    getPatients(1, 50),
    getPatientStats(),
  ]);

  return (
    <div className="@container/main flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Pacienți</h1>
        <p className="text-muted-foreground">Administrează înregistrările și informațiile pacienților</p>
      </div>

      <div className="grid @5xl/main:grid-cols-3 @xl/main:grid-cols-3 grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total pacienți</CardDescription>
            <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
              {patientData.total}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <Users className="size-3" />
                Din totdeauna
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Total pacienți înregistrați
            </div>
            <div className="text-muted-foreground">În baza de date a clinicii</div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Luna aceasta</CardDescription>
            <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
              {stats.thisMonth}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <TrendingUp className="size-3" />
                Nou
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Înregistrări noi <UserPlus className="size-4" />
            </div>
            <div className="text-muted-foreground">Pacienți înregistrați luna aceasta</div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Săptămâna aceasta</CardDescription>
            <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
              {stats.thisWeek}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <TrendingUp className="size-3" />
                Recent
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Activitate săptămânală <UserPlus className="size-4" />
            </div>
            <div className="text-muted-foreground">Pacienți noi săptămâna aceasta</div>
          </CardFooter>
        </Card>
      </div>

      <PatientsTable patients={patientData.patients as Patient[]} />
    </div>
  );
}
