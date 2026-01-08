"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createPatientAdmin } from "@/lib/actions/patient.actions";
import type { Patient } from "@/types/appwrite.types";

const quickPatientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
});

type QuickPatientValues = z.infer<typeof quickPatientSchema>;

interface PatientQuickCreateProps {
  onSuccess: (patient: Patient) => void;
  onCancel: () => void;
  initialName?: string;
}

export const PatientQuickCreate = ({
  onSuccess,
  onCancel,
  initialName = "",
}: PatientQuickCreateProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<QuickPatientValues>({
    resolver: zodResolver(quickPatientSchema),
    defaultValues: {
      name: initialName,
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (values: QuickPatientValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const patient = await createPatientAdmin(values);
      if (patient) {
        onSuccess(patient as unknown as Patient);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while creating the patient";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">New Patient</CardTitle>
        <CardDescription>
          Fill in the details to register the patient
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. John Smith"
                      className="bg-background"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="patient@email.com"
                        className="bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone *</FormLabel>
                    <FormControl>
                      <PhoneInput
                        defaultCountry="US"
                        international
                        placeholder="+1 xxx xxx xxxx"
                        value={field.value}
                        onChange={field.onChange}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-within:ring-1 focus-within:ring-ring"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Register & Select"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
