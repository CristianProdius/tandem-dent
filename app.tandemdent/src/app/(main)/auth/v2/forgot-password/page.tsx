"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { ArrowLeft, Globe, Loader2, Mail, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { APP_CONFIG } from "@/config/app-config";
import { requestPasswordReset } from "@/lib/actions/auth.actions";

const emailSchema = z.object({
  email: z.string().email("Vă rugăm introduceți o adresă de email validă"),
});

type EmailFormValues = z.infer<typeof emailSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: EmailFormValues) => {
    setIsLoading(true);
    try {
      const result = await requestPasswordReset(data.email);

      // Always show success to prevent email enumeration
      setSubmittedEmail(data.email);
      setEmailSent(true);
    } catch (error) {
      console.error("Error requesting password reset:", error);
      // Still show success to prevent enumeration
      setSubmittedEmail(data.email);
      setEmailSent(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <>
        <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-medium text-3xl">Verificați emailul</h1>
            <p className="text-muted-foreground text-sm">
              Dacă există un cont asociat cu adresa{" "}
              <span className="font-medium text-foreground">{submittedEmail}</span>,
              veți primi un email cu instrucțiuni pentru resetarea parolei.
            </p>
          </div>

          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/auth/v2/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Înapoi la autentificare
              </Link>
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Nu ați primit emailul?{" "}
              <button
                type="button"
                className="text-foreground hover:underline"
                onClick={() => {
                  setEmailSent(false);
                  form.reset();
                }}
              >
                Încercați din nou
              </button>
            </p>
          </div>
        </div>

        <div className="absolute bottom-5 flex w-full justify-between px-10">
          <div className="text-sm">{APP_CONFIG.copyright}</div>
          <div className="flex items-center gap-1 text-sm">
            <Globe className="size-4 text-muted-foreground" />
            RO
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-medium text-3xl">Ați uitat parola?</h1>
          <p className="text-muted-foreground text-sm">
            Introduceți adresa de email asociată contului și vă vom trimite un link pentru resetarea parolei.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="exemplu@email.com"
                      autoComplete="email"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Se trimite...
                </>
              ) : (
                "Trimite link de resetare"
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <Link
            href="/auth/v2/login"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Înapoi la autentificare
          </Link>
        </div>
      </div>

      <div className="absolute bottom-5 flex w-full justify-between px-10">
        <div className="text-sm">{APP_CONFIG.copyright}</div>
        <div className="flex items-center gap-1 text-sm">
          <Globe className="size-4 text-muted-foreground" />
          RO
        </div>
      </div>
    </>
  );
}
