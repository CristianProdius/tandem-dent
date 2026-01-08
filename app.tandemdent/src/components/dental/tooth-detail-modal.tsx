"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  TOOTH_CONDITIONS,
  TOOTH_NAMES,
  TREATMENT_STATUS,
  TREATMENT_TYPES,
} from "@/constants/dental";
import { createTreatment } from "@/lib/actions/treatment.actions";
import type { Doctor, Treatment } from "@/types/appwrite.types";

import { TreatmentCard } from "./treatment-card";

const treatmentFormSchema = z.object({
  condition: z.string().min(1, "Selectați o afecțiune"),
  treatment: z.string().min(1, "Selectați un tratament"),
  status: z.string().min(1, "Selectați un status"),
  doctorId: z.string().min(1, "Selectați un medic"),
  notes: z.string().optional(),
});

type TreatmentFormValues = z.infer<typeof treatmentFormSchema>;

interface ToothDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  toothNumber: number;
  patientId: string;
  treatments: Treatment[];
  doctors: Doctor[];
  onTreatmentAdded: () => void;
}

export function ToothDetailModal({
  isOpen,
  onClose,
  toothNumber,
  patientId,
  treatments,
  doctors,
  onTreatmentAdded,
}: ToothDetailModalProps) {
  const [isAddingTreatment, setIsAddingTreatment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TreatmentFormValues>({
    resolver: zodResolver(treatmentFormSchema),
    defaultValues: {
      condition: "",
      treatment: "",
      status: "pending",
      doctorId: "",
      notes: "",
    },
  });

  const onSubmit = async (values: TreatmentFormValues) => {
    setIsLoading(true);
    try {
      const selectedDoctor = doctors.find((d) => d.$id === values.doctorId);

      await createTreatment({
        patientId,
        toothNumber,
        condition: values.condition as Treatment["condition"],
        treatment: values.treatment as Treatment["treatment"],
        status: values.status as Treatment["status"],
        doctorId: values.doctorId,
        doctorName: selectedDoctor?.name,
        notes: values.notes,
        date: new Date().toISOString(),
      });

      form.reset();
      setIsAddingTreatment(false);
      onTreatmentAdded();
    } catch (error) {
      console.error("Error creating treatment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toothName = TOOTH_NAMES[toothNumber] || `Dinte ${toothNumber}`;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
              {toothNumber}
            </span>
            <span>{toothName}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Treatment History */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Istoric tratamente ({treatments.length})
              </h3>
              {!isAddingTreatment && (
                <Button
                  onClick={() => setIsAddingTreatment(true)}
                  size="sm"
                  className="gap-1"
                >
                  <Plus className="size-4" />
                  Adaugă tratament
                </Button>
              )}
            </div>

            {treatments.length === 0 && !isAddingTreatment ? (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">
                    Niciun tratament înregistrat pentru acest dinte.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {treatments.map((treatment) => (
                  <TreatmentCard
                    key={treatment.$id}
                    treatment={treatment}
                    compact
                  />
                ))}
              </div>
            )}
          </div>

          {/* Add Treatment Form */}
          {isAddingTreatment && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Tratament nou</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsAddingTreatment(false);
                      form.reset();
                    }}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      {/* Condition */}
                      <FormField
                        control={form.control}
                        name="condition"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Afecțiune</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selectați afecțiune" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(TOOTH_CONDITIONS).map(
                                  ([key, { label }]) => (
                                    <SelectItem key={key} value={key}>
                                      {label}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Treatment */}
                      <FormField
                        control={form.control}
                        name="treatment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tratament</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selectați tratament" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(TREATMENT_TYPES).map(
                                  ([key, { label }]) => (
                                    <SelectItem key={key} value={key}>
                                      {label}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Doctor */}
                      <FormField
                        control={form.control}
                        name="doctorId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Medic</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selectați medic" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {doctors.map((doctor) => (
                                  <SelectItem key={doctor.$id} value={doctor.$id}>
                                    Dr. {doctor.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Status */}
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selectați status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(TREATMENT_STATUS).map(
                                  ([key, { label }]) => (
                                    <SelectItem key={key} value={key}>
                                      {label}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Notes */}
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Note (opțional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Adăugați note despre tratament..."
                              className="resize-none"
                              rows={2}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsAddingTreatment(false);
                          form.reset();
                        }}
                        disabled={isLoading}
                      >
                        Anulează
                      </Button>
                      <Button
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? "Se salvează..." : "Salvează"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
