import { Banknote, CreditCard, DollarSign, TrendingUp } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BillingPage() {
  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Facturare și venituri</h1>
          <p className="text-muted-foreground">Urmărește veniturile și plățile clinicii</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs">
        <Card className="@container/card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Venituri lunare</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">0.00 MDL</div>
            <p className="text-xs text-muted-foreground">Luna aceasta</p>
          </CardContent>
        </Card>
        <Card className="@container/card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Restante</CardTitle>
            <Banknote className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">0.00 MDL</div>
            <p className="text-xs text-muted-foreground">Plăți în așteptare</p>
          </CardContent>
        </Card>
        <Card className="@container/card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Încasat azi</CardTitle>
            <CreditCard className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">0.00 MDL</div>
            <p className="text-xs text-muted-foreground">Încasările de azi</p>
          </CardContent>
        </Card>
        <Card className="@container/card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tratament mediu</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">0.00 MDL</div>
            <p className="text-xs text-muted-foreground">Valoare medie</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prezentare venituri</CardTitle>
          <CardDescription>
            Urmărirea veniturilor și gestionarea plăților în curând.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-20">
          <Banknote className="h-16 w-16 text-muted-foreground/30" />
          <h3 className="mt-4 text-lg font-semibold">În curând</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md mt-2">
            Funcțiile complete de facturare și urmărire a veniturilor sunt în dezvoltare.
            Vor include urmărirea plăților, facturare și analiza veniturilor.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
