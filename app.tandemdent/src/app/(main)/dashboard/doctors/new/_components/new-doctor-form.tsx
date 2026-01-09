"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

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
import { Checkbox } from "@/components/ui/checkbox";
import { createDoctorWithPassword } from "@/lib/actions/auth.actions";

const formSchema = z.object({
  name: z.string().min(2, "Numele trebuie să aibă cel puțin 2 caractere"),
  email: z.string().email("Vă rugăm introduceți o adresă de email validă"),
  phone: z.string().min(10, "Vă rugăm introduceți un număr de telefon valid"),
  specialty: z.string().min(1, "Vă rugăm selectați o specialitate"),
  setPassword: z.boolean().default(false),
  password: z.string().optional(),
}).refine((data) => {
  if (data.setPassword && (!data.password || data.password.length < 8)) {
    return false;
  }
  return true;
}, {
  message: "Parola trebuie să aibă cel puțin 8 caractere",
  path: ["password"],
}).refine((data) => {
  if (data.setPassword && data.password && !/[A-Z]/.test(data.password)) {
    return false;
  }
  return true;
}, {
  message: "Parola trebuie să conțină cel puțin o literă mare",
  path: ["password"],
}).refine((data) => {
  if (data.setPassword && data.password && !/[a-z]/.test(data.password)) {
    return false;
  }
  return true;
}, {
  message: "Parola trebuie să conțină cel puțin o literă mică",
  path: ["password"],
}).refine((data) => {
  if (data.setPassword && data.password && !/[0-9]/.test(data.password)) {
    return false;
  }
  return true;
}, {
  message: "Parola trebuie să conțină cel puțin o cifră",
  path: ["password"],
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
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      specialty: "",
      setPassword: false,
      password: "",
    },
  });

  const watchSetPassword = form.watch("setPassword");

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      const result = await createDoctorWithPassword({
        name: values.name,
        email: values.email,
        phone: values.phone,
        specialty: values.specialty,
        password: values.setPassword ? values.password : undefined,
      });

      if (result.success) {
        toast.success("Medic adăugat cu succes!", {
          description: values.setPassword
            ? "Medicul poate acum să se autentifice cu email și parolă."
            : "Medicul va primi un link magic pe email pentru autentificare.",
        });
        router.push("/dashboard/doctors");
        router.refresh();
      } else {
        toast.error("Eroare", {
          description: result.error || "Nu s-a putut adăuga medicul.",
        });
      }
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

            <div className="space-y-4 rounded-lg border p-4">
              <FormField
                control={form.control}
                name="setPassword"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Setează parolă de acces</FormLabel>
                      <FormDescription>
                        Permite medicului să se autentifice cu email și parolă.
                        Dacă nu setați o parolă, medicul va folosi link magic.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {watchSetPassword && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parolă</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Min. 8 caractere, 1 majusculă, 1 minusculă, 1 cifră
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

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
