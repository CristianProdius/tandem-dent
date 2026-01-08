"use client";

import {
  Calendar,
  Clock,
  FileText,
  Mail,
  MapPin,
  Phone,
  Shield,
  Stethoscope,
  User,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDoctors } from "@/lib/actions/doctor.actions";
import {
  getPatientToothConditions,
  getTreatmentsByPatient,
  getTreatmentsByTooth,
} from "@/lib/actions/treatment.actions";
import { formatDateTime } from "@/lib/utils";
import type {
  Appointment,
  Doctor,
  Patient,
  ToothCondition,
  Treatment,
} from "@/types/appwrite.types";

import { Odontogram } from "./odontogram";
import { StatusBadge } from "./status-badge";
import { ToothDetailModal } from "./tooth-detail-modal";
import { TreatmentCard } from "./treatment-card";

interface PatientTabsProps {
  patient: Patient;
  appointments: Appointment[];
}

export function PatientTabs({ patient, appointments }: PatientTabsProps) {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [toothConditions, setToothConditions] = useState<Record<number, ToothCondition>>({});
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [selectedToothTreatments, setSelectedToothTreatments] = useState<Treatment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      const [conditions, allTreatments, doctorsResult] = await Promise.all([
        getPatientToothConditions(patient.$id),
        getTreatmentsByPatient(patient.$id),
        getDoctors(),
      ]);
      setToothConditions(conditions);
      setTreatments(allTreatments);
      setDoctors(doctorsResult.documents);
    };
    loadData();
  }, [patient.$id]);

  // Load treatments for selected tooth
  const handleToothClick = useCallback(async (toothNumber: number) => {
    setSelectedTooth(toothNumber);
    const toothTreatments = await getTreatmentsByTooth(patient.$id, toothNumber);
    setSelectedToothTreatments(toothTreatments);
    setIsModalOpen(true);
  }, [patient.$id]);

  // Refresh data after adding treatment
  const handleTreatmentAdded = useCallback(async () => {
    const [conditions, allTreatments] = await Promise.all([
      getPatientToothConditions(patient.$id),
      getTreatmentsByPatient(patient.$id),
    ]);
    setToothConditions(conditions);
    setTreatments(allTreatments);

    // Also refresh selected tooth treatments
    if (selectedTooth) {
      const toothTreatments = await getTreatmentsByTooth(patient.$id, selectedTooth);
      setSelectedToothTreatments(toothTreatments);
    }
  }, [patient.$id, selectedTooth]);

  // Separate appointments into upcoming and past
  const now = new Date();
  const upcomingAppointments = appointments.filter(
    (a) => new Date(a.schedule) >= now && a.status !== "cancelled"
  );
  const pastAppointments = appointments.filter(
    (a) => new Date(a.schedule) < now || a.status === "cancelled"
  );

  return (
    <>
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info" className="gap-2">
            <User className="size-4" />
            <span className="hidden sm:inline">Patient Info</span>
          </TabsTrigger>
          <TabsTrigger value="appointments" className="gap-2">
            <Calendar className="size-4" />
            <span className="hidden sm:inline">Appointments</span>
          </TabsTrigger>
          <TabsTrigger value="medical" className="gap-2">
            <FileText className="size-4" />
            <span className="hidden sm:inline">Medical Record</span>
          </TabsTrigger>
        </TabsList>

        {/* Patient Information Tab */}
        <TabsContent value="info" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Personal Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="size-5 text-primary" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoRow icon={Mail} label="Email" value={patient.email} />
                <InfoRow icon={Phone} label="Phone" value={patient.phone} />
                <InfoRow
                  icon={Calendar}
                  label="Date of Birth"
                  value={new Date(patient.birthDate).toLocaleDateString()}
                />
                <InfoRow icon={User} label="Gender" value={patient.gender} />
                <InfoRow icon={MapPin} label="Address" value={patient.address} />
              </CardContent>
            </Card>

            {/* Medical Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Stethoscope className="size-5 text-primary" />
                  Medical Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoRow
                  icon={Stethoscope}
                  label="Primary Doctor"
                  value={patient.primaryPhysician || "Not specified"}
                />
                <InfoRow
                  icon={Shield}
                  label="Insurance"
                  value={patient.insuranceProvider || "Not specified"}
                />
                {patient.allergies && (
                  <InfoRow
                    icon={Shield}
                    label="Allergies"
                    value={patient.allergies}
                    variant="warning"
                  />
                )}
                {patient.currentMedication && (
                  <InfoRow
                    icon={FileText}
                    label="Current Medication"
                    value={patient.currentMedication}
                  />
                )}
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            {patient.emergencyContactName && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Phone className="size-5 text-primary" />
                    Emergency Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <InfoRow
                    icon={User}
                    label="Name"
                    value={patient.emergencyContactName}
                  />
                  <InfoRow
                    icon={Phone}
                    label="Phone"
                    value={patient.emergencyContactNumber}
                  />
                </CardContent>
              </Card>
            )}

            {/* Registration Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="size-5 text-primary" />
                  Registration Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoRow
                  icon={Calendar}
                  label="Registration Date"
                  value={new Date(patient.$createdAt).toLocaleDateString()}
                />
                <InfoRow icon={FileText} label="Patient ID" value={patient.$id} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="mt-6">
          <div className="space-y-6">
            {/* Upcoming Appointments */}
            {upcomingAppointments.length > 0 && (
              <div>
                <h3 className="mb-4 text-lg font-semibold">
                  Upcoming Appointments ({upcomingAppointments.length})
                </h3>
                <div className="space-y-3">
                  {upcomingAppointments.map((appointment) => (
                    <AppointmentCard key={appointment.$id} appointment={appointment} />
                  ))}
                </div>
              </div>
            )}

            {/* Past Appointments */}
            {pastAppointments.length > 0 && (
              <div>
                <h3 className="mb-4 text-lg font-semibold">
                  Appointment History ({pastAppointments.length})
                </h3>
                <div className="space-y-3">
                  {pastAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.$id}
                      appointment={appointment}
                      isPast
                    />
                  ))}
                </div>
              </div>
            )}

            {appointments.length === 0 && (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">
                    No appointments recorded for this patient.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Medical Record Tab */}
        <TabsContent value="medical" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Odontogram */}
            <Card>
              <CardHeader>
                <CardTitle>Odontogram</CardTitle>
              </CardHeader>
              <CardContent>
                <Odontogram
                  toothConditions={toothConditions}
                  selectedTooth={selectedTooth}
                  onToothClick={handleToothClick}
                />
                <p className="mt-4 text-sm text-muted-foreground text-center">
                  Click on a tooth to view or add treatments
                </p>
              </CardContent>
            </Card>

            {/* Recent Treatments */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Recent Treatments ({treatments.length})
              </h3>
              {treatments.length > 0 ? (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {treatments.slice(0, 10).map((treatment) => (
                    <TreatmentCard
                      key={treatment.$id}
                      treatment={treatment}
                      showTooth
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8">
                    <p className="text-center text-muted-foreground">
                      No treatments recorded.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Tooth Detail Modal */}
      {selectedTooth && (
        <ToothDetailModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTooth(null);
          }}
          toothNumber={selectedTooth}
          patientId={patient.$id}
          treatments={selectedToothTreatments}
          doctors={doctors}
          onTreatmentAdded={handleTreatmentAdded}
        />
      )}
    </>
  );
}

// Helper components
interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
  variant?: "default" | "warning";
}

function InfoRow({ icon: Icon, label, value, variant = "default" }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="size-4 text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p
          className={
            variant === "warning"
              ? "font-medium text-orange-600"
              : "text-foreground"
          }
        >
          {value}
        </p>
      </div>
    </div>
  );
}

interface AppointmentCardProps {
  appointment: Appointment;
  isPast?: boolean;
}

function AppointmentCard({ appointment, isPast }: AppointmentCardProps) {
  const { dateOnly, timeOnly } = formatDateTime(appointment.schedule);

  return (
    <Card className={isPast ? "opacity-75" : ""}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center justify-center rounded-xl bg-primary/10 px-3 py-2 min-w-[70px]">
              <span className="text-xs text-primary">{dateOnly.split(" ")[1]}</span>
              <span className="text-xl font-bold text-primary">
                {dateOnly.split(" ")[0]}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <StatusBadge status={appointment.status as "scheduled" | "pending" | "cancelled"} />
              </div>
              <p className="font-medium">
                Dr. {appointment.primaryPhysician}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {timeOnly}
                </span>
                <span>{appointment.reason}</span>
              </div>
            </div>
          </div>
        </div>
        {appointment.note && (
          <p className="mt-3 text-sm text-muted-foreground pl-[86px]">
            <span className="font-medium">Note:</span> {appointment.note}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
