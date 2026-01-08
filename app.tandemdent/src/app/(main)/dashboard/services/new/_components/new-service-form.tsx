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
  FormDescription,
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createService } from "@/lib/actions/service.actions";

const formSchema = z.object({
  name: z.string().min(2, "Numele trebuie să aibă cel puțin 2 caractere"),
  description: z.string().optional(),
  duration: z.coerce.number().min(5, "Durata trebuie să fie cel puțin 5 minute"),
  price: z.coerce.number().min(0, "Prețul nu poate fi negativ"),
  category: z.enum(["medical", "cosmetic", "preventive", "emergency"]),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const categories = [
  { value: "medical", label: "Medical" },
  { value: "cosmetic", label: "Cosmetic" },
  { value: "preventive", label: "Preventiv" },
  { value: "emergency", label: "Urgență" },
];

export function NewServiceForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      duration: 30,
      price: 0,
      category: "medical",
      isActive: true,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      await createService({
        name: values.name,
        description: values.description || "",
        duration: values.duration,
        price: values.price,
        category: values.category,
        isActive: values.isActive,
      });

      toast.success("Serviciu adăugat cu succes!");
      router.push("/dashboard/services");
      router.refresh();
    } catch (error) {
      console.error("Error creating service:", error);
      toast.error("Eroare la adăugarea serviciului. Vă rugăm încercați din nou.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Informații serviciu</CardTitle>
        <CardDescription>
          Completați detaliile de mai jos pentru a adăuga un nou serviciu în catalog.
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
                  <FormLabel>Nume serviciu</FormLabel>
                  <FormControl>
                    <Input placeholder="ex. Curățare dentară" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descriere</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descriere scurtă a serviciului..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durată (minute)</FormLabel>
                    <FormControl>
                      <Input type="number" min={5} step={5} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preț (MDL)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categorie</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectați o categorie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
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
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Serviciu activ</FormLabel>
                    <FormDescription>
                      Când este activat, acest serviciu va fi disponibil pentru programare.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Se adaugă..." : "Adaugă serviciu"}
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
