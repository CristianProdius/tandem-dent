"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import {
  ArrowLeft,
  Globe,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { APP_CONFIG } from "@/config/app-config";
import { validateAdminInvite, acceptAdminInvite } from "@/lib/actions/auth.actions";

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Parola trebuie să aibă cel puțin 8 caractere")
      .regex(/[A-Z]/, "Parola trebuie să conțină cel puțin o literă mare")
      .regex(/[a-z]/, "Parola trebuie să conțină cel puțin o literă mică")
      .regex(/[0-9]/, "Parola trebuie să conțină cel puțin o cifră"),
    confirmPassword: z.string().min(1, "Confirmarea parolei este obligatorie"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Parolele nu se potrivesc",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

function AcceptInviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptSuccess, setAcceptSuccess] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Validate token on mount
  useEffect(() => {
    async function checkToken() {
      if (!token || !email) {
        setTokenError("Link de invitație invalid");
        setIsValidating(false);
        return;
      }

      try {
        const result = await validateAdminInvite(token, email);
        setIsTokenValid(result.valid);
        if (result.valid && result.adminName) {
          setAdminName(result.adminName);
        } else {
          setTokenError(result.error || "Link de invitație invalid");
        }
      } catch (error) {
        setTokenError("Eroare la validarea invitației");
      } finally {
        setIsValidating(false);
      }
    }

    checkToken();
  }, [token, email]);

  const onSubmit = async (data: PasswordFormValues) => {
    setIsLoading(true);
    try {
      const result = await acceptAdminInvite(token, email, data.password);

      if (result.success) {
        setAcceptSuccess(true);
        toast.success("Cont activat cu succes!");
      } else {
        toast.error("Eroare", {
          description: result.error || "Nu s-a putut activa contul",
        });
      }
    } catch (error) {
      console.error("Error accepting invite:", error);
      toast.error("Eroare la activarea contului");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isValidating) {
    return (
      <>
        <div className="mx-auto flex w-full flex-col items-center justify-center space-y-4 sm:w-[350px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Se verifică invitația...</p>
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

  // Invalid token state
  if (!isTokenValid) {
    return (
      <>
        <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="font-medium text-3xl">Invitație invalidă</h1>
            <p className="text-muted-foreground text-sm">
              {tokenError || "Link-ul de invitație este invalid sau a expirat."}
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              Contactați administratorul pentru a primi o nouă invitație.
            </p>

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

  // Success state
  if (acceptSuccess) {
    return (
      <>
        <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-medium text-3xl">Bine ați venit!</h1>
            <p className="text-muted-foreground text-sm">
              Contul dvs. de administrator a fost activat cu succes. Puteți acum să vă autentificați.
            </p>
          </div>

          <Button asChild className="w-full">
            <Link href="/auth/v2/login">Autentificați-vă</Link>
          </Button>
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

  // Accept form
  return (
    <>
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-medium text-3xl">Bine ați venit, {adminName}!</h1>
          <p className="text-muted-foreground text-sm">
            Configurați parola pentru contul dvs. de administrator
          </p>
        </div>

        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm text-center">
            <strong>Email:</strong> {email}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        autoComplete="new-password"
                        disabled={isLoading}
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
                  <FormDescription className="text-xs">
                    Min. 8 caractere, 1 majusculă, 1 minusculă, 1 cifră
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmă parola</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        disabled={isLoading}
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Se activează...
                </>
              ) : (
                "Activează contul"
              )}
            </Button>
          </form>
        </Form>
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

export default function AcceptInvitePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex w-full flex-col items-center justify-center space-y-4 sm:w-[350px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Se încarcă...</p>
        </div>
      }
    >
      <AcceptInviteContent />
    </Suspense>
  );
}
