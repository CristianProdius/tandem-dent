import { Briefcase, Clock, DollarSign, Plus } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllServices } from "@/lib/actions/service.actions";
import { formatCurrency } from "@/lib/utils";

export default async function ServicesPage() {
  const services = await getAllServices();
  const activeServices = services.filter((s) => s.isActive);
  const medicalServices = services.filter((s) => s.category === "medical");
  const cosmeticServices = services.filter((s) => s.category === "cosmetic");

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Servicii</h1>
          <p className="text-muted-foreground">Administrează serviciile și prețurile clinicii</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/services/new">
            <Plus className="mr-2 h-4 w-4" />
            Adaugă serviciu
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total servicii</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Briefcase className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeServices.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medicale</CardTitle>
            <Briefcase className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{medicalServices.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cosmetice</CardTitle>
            <Briefcase className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cosmeticServices.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Toate serviciile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.length > 0 ? (
              services.map((service) => (
                <div
                  key={service.$id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{service.name}</span>
                        {!service.isActive && (
                          <Badge variant="secondary" className="text-xs">
                            Inactiv
                          </Badge>
                        )}
                        {service.category && (
                          <Badge
                            variant="outline"
                            className={
                              service.category === "medical"
                                ? "text-blue-600 border-blue-200"
                                : "text-purple-600 border-purple-200"
                            }
                          >
                            {service.category === "medical" ? "Medical" : "Cosmetic"}
                          </Badge>
                        )}
                      </div>
                      {service.description && (
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {service.duration} min
                    </div>
                    <div className="flex items-center gap-1 font-medium">
                      <DollarSign className="h-4 w-4" />
                      {formatCurrency(service.price, { currency: "MDL", locale: "ro-MD" })}
                    </div>
                    <Button variant="outline" size="sm">
                      Editează
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                <Briefcase className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">Niciun serviciu încă</h3>
                <p className="text-sm text-muted-foreground">Adaugă primul serviciu pentru a începe.</p>
                <Button className="mt-4" asChild>
                  <Link href="/dashboard/services/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Adaugă serviciu
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
