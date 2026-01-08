"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createAppointment } from "@/lib/actions/appointment.actions";
import type { Doctor, Patient, Service } from "@/types/appwrite.types";

const formSchema = z.object({
  patientId: z.string().min(1, "Vă rugăm selectați un pacient"),
  doctorId: z.string().min(1, "Vă rugăm selectați un medic"),
  serviceId: z.string().min(1, "Vă rugăm selectați un serviciu"),
  date: z.date({ required_error: "Vă rugăm selectați o dată" }),
  time: z.string().min(1, "Vă rugăm selectați o oră"),
  status: z.enum(["pending", "scheduled", "cancelled"]),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface NewAppointmentFormProps {
  doctors: Doctor[];
  patients: Patient[];
  services: Service[];
}

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
];

export function NewAppointmentForm({
  doctors,
  patients,
  services,
}: NewAppointmentFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
      doctorId: "",
      serviceId: "",
      time: "",
      status: "pending",
      note: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      const selectedPatient = patients.find((p) => p.$id === values.patientId);
      const selectedDoctor = doctors.find((d) => d.$id === values.doctorId);
      const selectedService = services.find((s) => s.$id === values.serviceId);

      if (!selectedPatient || !selectedDoctor) {
        toast.error("Pacient sau medic selectat invalid");
        return;
      }

      // Combine date and time
      const [hours, minutes] = values.time.split(":").map(Number);
      const schedule = new Date(values.date);
      schedule.setHours(hours, minutes, 0, 0);

      await createAppointment({
        patient: selectedPatient.$id,
        userId: selectedPatient.userId,
        schedule: schedule,
        status: values.status,
        primaryPhysician: selectedDoctor.name,
        reason: selectedService?.name || "Consultation",
        note: values.note || "",
        doctorId: selectedDoctor.$id,
      });

      toast.success("Programare creată cu succes!");
      router.push("/dashboard/appointments");
      router.refresh();
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Eroare la crearea programării. Vă rugăm încercați din nou.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Detalii programare</CardTitle>
        <CardDescription>
          Completați detaliile de mai jos pentru a programa o nouă consultație.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pacient</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectați un pacient" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.$id} value={patient.$id}>
                          {patient.name} ({patient.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="doctorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medic</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectați un medic" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.$id} value={doctor.$id}>
                          {doctor.name} - {doctor.specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serviciu</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectați un serviciu" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.$id} value={service.$id}>
                          {service.name} - {service.duration}min - {service.price} MDL
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Alegeți o dată</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                            date.getDay() === 0
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ora</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selectați ora" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectați status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">În așteptare</SelectItem>
                      <SelectItem value="scheduled">Programat</SelectItem>
                      <SelectItem value="cancelled">Anulat</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Setați ca &quot;Programat&quot; pentru a confirma programarea imediat.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note (Opțional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Orice notă suplimentară despre această programare..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Se creează..." : "Creează programare"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Anulează
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
