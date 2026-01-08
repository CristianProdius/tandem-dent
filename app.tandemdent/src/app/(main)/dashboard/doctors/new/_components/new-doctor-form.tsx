"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createDoctor } from "@/lib/actions/doctor.actions";

const formSchema = z.object({
  name: z.string().min(2, "Numele trebuie să aibă cel puțin 2 caractere"),
  email: z.string().email("Vă rugăm introduceți o adresă de email validă"),
  phone: z.string().min(10, "Vă rugăm introduceți un număr de telefon valid"),
  specialty: z.string().min(1, "Vă rugăm selectați o specialitate"),
});

type FormValues = z.infer<typeof formSchema>;

const specialties = [
  "Stomatologie Generala",
  "Ortodontie",
  "Chirurgie Dentara",
  "Endodontie",
  "Parodontologie",
  "Protetica Dentara",
  "Implantologie",
  "Stomatologie Pediatrica",
];

export function NewDoctorForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      specialty: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      await createDoctor({
        name: values.name,
        email: values.email,
        phone: values.phone,
        specialty: values.specialty,
        googleCalendarConnected: false,
      });

      toast.success("Medic adăugat cu succes!");
      router.push("/dashboard/doctors");
      router.refresh();
    } catch (error) {
      console.error("Error creating doctor:", error);
      toast.error("Eroare la adăugarea medicului. Vă rugăm încercați din nou.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Informații medic</CardTitle>
        <CardDescription>
          Completați detaliile de mai jos pentru a adăuga un nou medic la clinică.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nume complet</FormLabel>
                  <FormControl>
                    <Input placeholder="Dr. Ion Popescu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="doctor@tandemdent.md"
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
                  <FormLabel>Telefon</FormLabel>
                  <FormControl>
                    <Input placeholder="+373 69 123 456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialitate</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectați o specialitate" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Se adaugă..." : "Adaugă medic"}
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
