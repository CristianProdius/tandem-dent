import { Activity, CheckCircle, Clock, Loader } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getTreatments, getTreatmentStats } from "@/lib/actions/treatment.actions";

import { TreatmentsTable } from "./_components/treatments-table";

export default async function TreatmentsPage() {
  const [stats, treatmentData] = await Promise.all([
    getTreatmentStats(),
    getTreatments({ limit: 50 }),
  ]);

  return (
    <div className="@container/main flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Tratamente</h1>
        <p className="text-muted-foreground">Urmărește și administrează tratamentele pacienților</p>
      </div>

      <div className="grid @5xl/main:grid-cols-4 @xl/main:grid-cols-2 grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total tratamente</CardDescription>
            <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
              {stats.totalCount}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <Activity className="size-3" />
                Toate
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Toate tratamentele înregistrate
            </div>
            <div className="text-muted-foreground">Pentru toți pacienții</div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>În așteptare</CardDescription>
            <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
              {stats.pendingCount}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="text-amber-600">
                <Clock className="size-3" />
                Așteptare
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Așteaptă tratament <Clock className="size-4 text-amber-600" />
            </div>
            <div className="text-muted-foreground">Programat pentru tratament</div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>În desfășurare</CardDescription>
            <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
              {stats.inProgressCount}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="text-blue-600">
                <Loader className="size-3" />
                Activ
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              În curs de tratare <Loader className="size-4 text-blue-600" />
            </div>
            <div className="text-muted-foreground">Proceduri în curs</div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Finalizate</CardDescription>
            <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
              {stats.doneCount}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="text-emerald-600">
                <CheckCircle className="size-3" />
                Gata
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Tratamente finalizate <CheckCircle className="size-4 text-emerald-600" />
            </div>
            <div className="text-muted-foreground">Finalizate cu succes</div>
          </CardFooter>
        </Card>
      </div>

      <TreatmentsTable treatments={treatmentData.documents} />
    </div>
  );
}
