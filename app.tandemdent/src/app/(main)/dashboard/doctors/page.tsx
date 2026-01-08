import { Calendar, Plus, UserCog } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDoctors } from "@/lib/actions/doctor.actions";

export default async function DoctorsPage() {
  const { documents: doctors } = await getDoctors();

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Medici</h1>
          <p className="text-muted-foreground">Administrează medicii clinicii și programul lor</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/doctors/new">
            <Plus className="mr-2 h-4 w-4" />
            Adaugă medic
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <Card key={doctor.$id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <UserCog className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{doctor.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{doctor.specialty || "General"}</p>
                    </div>
                  </div>
                  {doctor.googleCalendarConnected && (
                    <Badge variant="outline" className="text-emerald-600 border-emerald-200">
                      <Calendar className="mr-1 h-3 w-3" />
                      Calendar
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{doctor.email}</span>
                  </div>
                  {doctor.phone && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Telefon:</span>
                      <span>{doctor.phone}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href={`/dashboard/doctors/${doctor.$id}`}>Vezi profil</Link>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href={`/dashboard/doctors/${doctor.$id}/edit`}>Editează</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-10">
              <UserCog className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">Niciun medic încă</h3>
              <p className="text-sm text-muted-foreground">Adaugă primul medic pentru a începe.</p>
              <Button className="mt-4" asChild>
                <Link href="/dashboard/doctors/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Adaugă medic
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
