"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, Calendar, Clock, Mail, MapPin, Phone, User, FileText, Smile } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Odontogram } from "@/components/dental/odontogram";
import { ToothDetailModal } from "@/components/dental/tooth-detail-modal";
import { TreatmentCard } from "@/components/dental/treatment-card";
import { formatDateTime } from "@/lib/utils";
import type { Appointment, Doctor, Patient, ToothCondition, Treatment } from "@/types/appwrite.types";

interface PatientDetailViewProps {
  patient: Patient;
  treatments: Treatment[];
  appointments: Appointment[];
  doctors: Doctor[];
}

export function PatientDetailView({
  patient,
  treatments,
  appointments,
  doctors,
}: PatientDetailViewProps) {
  const router = useRouter();
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);

  const age = patient.birthDate
    ? Math.floor(
        (new Date().getTime() - new Date(patient.birthDate).getTime()) /
          (365.25 * 24 * 60 * 60 * 1000)
      )
    : null;

  // Build tooth conditions map from treatments
  const toothConditionsMap = useMemo(() => {
    const map: Record<number, ToothCondition> = {};
    // Sort by date to get the latest condition for each tooth
    const sortedTreatments = [...treatments].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    sortedTreatments.forEach((t) => {
      if (t.toothNumber && t.condition && !map[t.toothNumber]) {
        map[t.toothNumber] = t.condition as ToothCondition;
      }
    });
    return map;
  }, [treatments]);

  // Get treatments for selected tooth
  const selectedToothTreatments = useMemo(() => {
    if (!selectedTooth) return [];
    return treatments.filter((t) => t.toothNumber === selectedTooth);
  }, [treatments, selectedTooth]);

  // Filter treatments by category
  const medicalTreatments = useMemo(() => {
    const medicalTypes = ["examination", "root_canal", "extraction", "scaling", "tooth_filling"];
    return treatments.filter((t) => medicalTypes.includes(t.treatment || ""));
  }, [treatments]);

  const cosmeticTreatments = useMemo(() => {
    const cosmeticTypes = ["whitening", "crown", "implant", "polishing", "cleaning"];
    return treatments.filter((t) => cosmeticTypes.includes(t.treatment || ""));
  }, [treatments]);

  const handleToothClick = useCallback((toothNumber: number) => {
    setSelectedTooth(toothNumber);
  }, []);

  const handleTreatmentAdded = useCallback(() => {
    router.refresh();
  }, [router]);

  return (
    <div className="@container/main flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-semibold text-2xl">{patient.name}</h1>
          <p className="text-muted-foreground">
            ID Pacient: {patient.$id}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Editează Pacient</Button>
          <Button>Programare Nouă</Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Vizite</CardDescription>
            <CardTitle className="text-3xl">{appointments.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tratamente</CardDescription>
            <CardTitle className="text-3xl">{treatments.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>În Așteptare</CardDescription>
            <CardTitle className="text-3xl">
              {treatments.filter((t) => t.status === "pending").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Finalizate</CardDescription>
            <CardTitle className="text-3xl">
              {treatments.filter((t) => t.status === "done").length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Patient Info */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5" />
              Informații Pacient
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                <User className="size-8 text-primary" />
              </div>
              <div>
                <div className="font-medium">{patient.name}</div>
                <div className="text-muted-foreground text-sm">
                  {patient.gender === "male" ? "Masculin" : patient.gender === "female" ? "Feminin" : "Nespecificat"}
                  {age && `, ${age} ani`}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="size-4 text-muted-foreground" />
                <span>{patient.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="size-4 text-muted-foreground" />
                <span>{patient.phone}</span>
              </div>
              {patient.address && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="size-4 text-muted-foreground" />
                  <span>{patient.address}</span>
                </div>
              )}
              {patient.occupation && (
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="size-4 text-muted-foreground" />
                  <span>{patient.occupation}</span>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="font-medium text-sm">Medic Principal</div>
              <div className="text-muted-foreground text-sm">
                {patient.primaryPhysician || "Neasignat"}
              </div>
            </div>

            {patient.insuranceProvider && (
              <>
                <Separator />
                <div className="space-y-2">
                  <div className="font-medium text-sm">Asigurare</div>
                  <div className="text-muted-foreground text-sm">
                    {patient.insuranceProvider}
                    {patient.insurancePolicyNumber && (
                      <span className="block">Poliță: {patient.insurancePolicyNumber}</span>
                    )}
                  </div>
                </div>
              </>
            )}

            {patient.emergencyContactName && (
              <>
                <Separator />
                <div className="space-y-2">
                  <div className="font-medium text-sm">Contact de Urgență</div>
                  <div className="text-muted-foreground text-sm">
                    {patient.emergencyContactName}
                    {patient.emergencyContactNumber && (
                      <span className="block">{patient.emergencyContactNumber}</span>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Tabs Content */}
        <Card className="lg:col-span-2">
          <Tabs defaultValue="dental-chart" className="w-full">
            <CardHeader>
              <TabsList>
                <TabsTrigger value="dental-chart" className="gap-2">
                  <Smile className="size-4" />
                  Odontogramă
                </TabsTrigger>
                <TabsTrigger value="treatments">Tratamente</TabsTrigger>
                <TabsTrigger value="appointments">Programări</TabsTrigger>
                <TabsTrigger value="medical">Istoric Medical</TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent>
              {/* Dental Chart Tab */}
              <TabsContent value="dental-chart" className="mt-0 space-y-6">
                {/* Odontogram */}
                <div>
                  <h3 className="mb-4 text-sm font-medium text-muted-foreground">
                    Apăsați pe un dinte pentru a vedea istoricul tratamentelor
                  </h3>
                  <Odontogram
                    toothConditions={toothConditionsMap}
                    selectedTooth={selectedTooth}
                    onToothClick={handleToothClick}
                  />
                </div>

                {/* Treatment Timeline with Medical/Cosmetic Tabs */}
                <div>
                  <Tabs defaultValue="all" className="w-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Istoric Tratamente ({treatments.length})
                      </h3>
                      <TabsList className="h-8">
                        <TabsTrigger value="all" className="text-xs px-3">Toate</TabsTrigger>
                        <TabsTrigger value="medical" className="text-xs px-3">Medical</TabsTrigger>
                        <TabsTrigger value="cosmetic" className="text-xs px-3">Estetic</TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent value="all" className="mt-0">
                      {treatments.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground">
                          Nu există tratamente înregistrate.
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                          {treatments.map((treatment) => (
                            <TreatmentCard
                              key={treatment.$id}
                              treatment={treatment}
                              showTooth
                              compact
                            />
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="medical" className="mt-0">
                      {medicalTreatments.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground">
                          Nu există tratamente medicale înregistrate.
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                          {medicalTreatments.map((treatment) => (
                            <TreatmentCard
                              key={treatment.$id}
                              treatment={treatment}
                              showTooth
                              compact
                            />
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="cosmetic" className="mt-0">
                      {cosmeticTreatments.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground">
                          Nu există tratamente estetice înregistrate.
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                          {cosmeticTreatments.map((treatment) => (
                            <TreatmentCard
                              key={treatment.$id}
                              treatment={treatment}
                              showTooth
                              compact
                            />
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </TabsContent>

              {/* Treatments Tab (List View) */}
              <TabsContent value="treatments" className="mt-0">
                {treatments.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    Nu există tratamente înregistrate.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {treatments.map((treatment) => (
                      <div
                        key={treatment.$id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                            <Activity className="size-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">
                              Dinte #{treatment.toothNumber} - {treatment.treatment?.replace(/_/g, " ")}
                            </div>
                            <div className="text-muted-foreground text-sm">
                              {treatment.condition?.replace(/_/g, " ")} • {treatment.doctorName}
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            treatment.status === "done"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                              : treatment.status === "in_progress"
                                ? "border-amber-200 bg-amber-50 text-amber-600"
                                : "border-gray-200 bg-gray-50 text-gray-600"
                          }
                        >
                          {treatment.status === "done" ? "Finalizat" : treatment.status === "in_progress" ? "În desfășurare" : "În așteptare"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="appointments" className="mt-0">
                {appointments.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    Nu există programări înregistrate.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => {
                      const { dateOnly, timeOnly } = formatDateTime(appointment.schedule);
                      return (
                        <div
                          key={appointment.$id}
                          className="flex items-center justify-between rounded-lg border p-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                              <Calendar className="size-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{appointment.reason}</div>
                              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <Clock className="size-3" />
                                {dateOnly} la {timeOnly}
                              </div>
                              <div className="text-muted-foreground text-sm">
                                {appointment.primaryPhysician}
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              appointment.status === "scheduled"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                                : appointment.status === "pending"
                                  ? "border-amber-200 bg-amber-50 text-amber-600"
                                  : "border-red-200 bg-red-50 text-red-600"
                            }
                          >
                            {appointment.status === "scheduled" ? "Programat" : appointment.status === "pending" ? "În așteptare" : "Anulat"}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="medical" className="mt-0">
                <div className="space-y-6">
                  {patient.allergies && (
                    <div>
                      <h4 className="mb-2 font-medium">Alergii</h4>
                      <p className="text-muted-foreground text-sm">{patient.allergies}</p>
                    </div>
                  )}
                  {patient.currentMedication && (
                    <div>
                      <h4 className="mb-2 font-medium">Medicamente Curente</h4>
                      <p className="text-muted-foreground text-sm">{patient.currentMedication}</p>
                    </div>
                  )}
                  {patient.pastMedicalHistory && (
                    <div>
                      <h4 className="mb-2 font-medium">Istoric Medical</h4>
                      <p className="text-muted-foreground text-sm">{patient.pastMedicalHistory}</p>
                    </div>
                  )}
                  {patient.familyMedicalHistory && (
                    <div>
                      <h4 className="mb-2 font-medium">Istoric Medical Familial</h4>
                      <p className="text-muted-foreground text-sm">{patient.familyMedicalHistory}</p>
                    </div>
                  )}
                  {!patient.allergies &&
                    !patient.currentMedication &&
                    !patient.pastMedicalHistory &&
                    !patient.familyMedicalHistory && (
                      <div className="py-8 text-center text-muted-foreground">
                        Nu există istoric medical înregistrat.
                      </div>
                    )}
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>

      {/* Tooth Detail Modal */}
      {selectedTooth && (
        <ToothDetailModal
          isOpen={!!selectedTooth}
          onClose={() => setSelectedTooth(null)}
          toothNumber={selectedTooth}
          patientId={patient.$id}
          treatments={selectedToothTreatments}
          doctors={doctors}
          onTreatmentAdded={handleTreatmentAdded}
        />
      )}
    </div>
  );
}
