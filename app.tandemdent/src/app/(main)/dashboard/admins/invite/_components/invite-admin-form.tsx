"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Mail, User } from "lucide-react";

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
import { inviteAdmin } from "@/lib/actions/auth.actions";

const formSchema = z.object({
  name: z.string().min(2, "Numele trebuie să aibă cel puțin 2 caractere"),
  email: z.string().email("Vă rugăm introduceți o adresă de email validă"),
});

type FormValues = z.infer<typeof formSchema>;

interface InviteAdminFormProps {
  inviterName: string;
}

export function InviteAdminForm({ inviterName }: InviteAdminFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      const result = await inviteAdmin({
        name: values.name,
        email: values.email,
        inviterName,
      });

      if (result.success) {
        toast.success("Invitație trimisă!", {
          description: `Am trimis o invitație la ${values.email}. Noul administrator va primi un email cu instrucțiuni.`,
        });
        router.push("/dashboard/admins");
        router.refresh();
      } else {
        toast.error("Eroare", {
          description: result.error || "Nu s-a putut trimite invitația.",
        });
      }
    } catch (error) {
      console.error("Error inviting admin:", error);
      toast.error("Eroare", {
        description: "A apărut o eroare. Vă rugăm încercați din nou.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Detalii administrator</CardTitle>
        <CardDescription>
          Introduceți datele pentru noul administrator. Acesta va primi un email
          cu un link pentru a-și configura contul și parola.
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
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Ion Popescu"
                        className="pl-10"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </div>
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
                  <FormLabel>Adresă de email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="admin@tandemdent.md"
                        className="pl-10"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Invitația va fi trimisă la această adresă de email
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <h4 className="font-medium text-amber-800">
                Ce va primi noul administrator?
              </h4>
              <ul className="mt-2 space-y-1 text-sm text-amber-700">
                <li>• Un email cu link-ul de invitație</li>
                <li>• Link-ul expiră în 72 de ore</li>
                <li>• Va trebui să își seteze propria parolă</li>
                <li>• Va avea acces complet la panoul de administrare</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Se trimite...
                  </>
                ) : (
                  "Trimite invitația"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
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
