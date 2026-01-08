"use client";

import { Calendar, CircleCheck, Clock, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface AppointmentsStatsProps {
  scheduledCount: number;
  pendingCount: number;
  cancelledCount: number;
  totalCount: number;
}

export function AppointmentsStats({
  scheduledCount,
  pendingCount,
  cancelledCount,
  totalCount,
}: AppointmentsStatsProps) {
  return (
    <div className="grid @5xl/main:grid-cols-4 @xl/main:grid-cols-2 grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total programări</CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
            {totalCount}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <Calendar className="size-3" />
              Toate
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total programări efectuate
          </div>
          <div className="text-muted-foreground">Pe toate perioadele</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Programate</CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
            {scheduledCount}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-emerald-600">
              <CircleCheck className="size-3" />
              Confirmat
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Programări confirmate <CircleCheck className="size-4 text-emerald-600" />
          </div>
          <div className="text-muted-foreground">Gata pentru vizita pacientului</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>În așteptare</CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
            {pendingCount}
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
            Așteaptă confirmare <Clock className="size-4 text-amber-600" />
          </div>
          <div className="text-muted-foreground">Necesită revizuire personal</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Anulate</CardDescription>
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
            Programări anulate <XCircle className="size-4 text-red-600" />
          </div>
          <div className="text-muted-foreground">Nu mai sunt programate</div>
        </CardFooter>
      </Card>
    </div>
  );
}
