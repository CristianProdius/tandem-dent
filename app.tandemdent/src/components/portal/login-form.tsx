"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Mail, ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  loginWithPassword,
  verifyOTPAndLogin,
  sendPatientMagicLink,
  resendOTP,
} from "@/lib/actions/auth.actions";

const emailSchema = z.object({
  email: z.string().email("Vă rugăm introduceți o adresă de email validă"),
});

const passwordSchema = z.object({
  password: z.string().min(1, "Parola este obligatorie"),
});

const otpSchema = z.object({
  otp: z.string().min(6, "Codul trebuie să aibă 6 cifre"),
});

type Step = "email" | "password" | "new-device-otp" | "magic-link-sent";

export function LoginForm() {
  const [step, setStep] = useState<Step>("email");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [hasPassword, setHasPassword] = useState(true);

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "" },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const handleEmailSubmit = async (data: z.infer<typeof emailSchema>) => {
    setEmail(data.email);
    setStep("password");
  };

  const handlePasswordSubmit = async (data: z.infer<typeof passwordSchema>) => {
    setIsLoading(true);
    try {
      const result = await loginWithPassword(email, data.password);

      if (result.success) {
        if (result.requiresOTP) {
          // New device detected, OTP verification required
          setUserId(result.userId || "");
          setStep("new-device-otp");
          toast.info("Dispozitiv nou detectat", {
            description: "Am trimis un cod de verificare pe email.",
          });
        } else {
          // Login successful
          toast.success("Autentificare reușită!");
          window.location.href = "/portal/dashboard";
        }
      } else {
        if (result.error?.includes("nu are parolă")) {
          // User doesn't have password set, fallback to magic link
          setHasPassword(false);
          toast.info("Cont fără parolă", {
            description: "Vă trimitem un link de autentificare pe email.",
          });
          await sendPatientMagicLink(email);
          setStep("magic-link-sent");
        } else {
          toast.error("Eroare la autentificare", {
            description: result.error || "Email sau parolă incorectă.",
          });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Eroare", {
        description: "A apărut o eroare. Vă rugăm încercați din nou.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (data: z.infer<typeof otpSchema>) => {
    setIsLoading(true);
    try {
      const result = await verifyOTPAndLogin(userId, "patient", data.otp);

      if (result.success) {
        toast.success("Dispozitiv verificat!");
        window.location.href = "/portal/dashboard";
      } else {
        toast.error("Cod invalid", {
          description: result.error || "Codul introdus nu este corect.",
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("OTP error:", error);
      toast.error("Eroare", {
        description: "A apărut o eroare. Vă rugăm încercați din nou.",
      });
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const result = await resendOTP(userId, "patient");
      if (result.success) {
        toast.success("Cod retrimis", {
          description: "Verificați emailul pentru noul cod.",
        });
      } else {
        toast.error("Eroare", {
          description: result.error || "Nu s-a putut retrimite codul.",
        });
      }
    } catch {
      toast.error("Eroare", {
        description: "A apărut o eroare la retrimiterea codului.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLinkFallback = async () => {
    setIsLoading(true);
    try {
      await sendPatientMagicLink(email);
      setStep("magic-link-sent");
      toast.success("Link trimis!", {
        description: "Verificați emailul pentru link-ul de autentificare.",
      });
    } catch {
      toast.error("Eroare", {
        description: "Nu s-a putut trimite link-ul.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (step === "password") {
      setStep("email");
      passwordForm.reset();
    } else if (step === "new-device-otp") {
      setStep("password");
      otpForm.reset();
    }
  };

  // Magic link sent confirmation
  if (step === "magic-link-sent") {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-500/20">
            <CheckCircle className="size-8 text-emerald-600" />
          </div>
          <h2 className="mb-2 text-xl font-semibold">Verificați emailul</h2>
          <p className="text-muted-foreground">
            Am trimis un link de autentificare la <strong>{email}</strong>.
            Click pe link pentru a accesa portalul.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Link-ul expiră în 15 minute.
          </p>
          <Button
            variant="ghost"
            className="mt-4"
            onClick={() => {
              setStep("email");
              emailForm.reset();
            }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Înapoi la login
          </Button>
        </CardContent>
      </Card>
    );
  }

  // New device OTP verification
  if (step === "new-device-otp") {
    return (
      <Card>
        <CardHeader>
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Înapoi
          </button>
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-center">Verificare dispozitiv</CardTitle>
          <CardDescription className="text-center">
            Am detectat un dispozitiv nou. Introduceți codul trimis pe <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={otpForm.handleSubmit(handleOTPSubmit)} className="space-y-4">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otpForm.watch("otp")}
                onChange={(value) => otpForm.setValue("otp", value)}
                disabled={isLoading}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            {otpForm.formState.errors.otp && (
              <p className="text-sm text-destructive text-center">
                {otpForm.formState.errors.otp.message}
              </p>
            )}
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Se verifică...
                </>
              ) : (
                "Verifică"
              )}
            </Button>
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={isLoading}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              Nu ați primit codul? Retrimite
            </button>
          </form>
        </CardContent>
      </Card>
    );
  }

  // Password step
  if (step === "password") {
    return (
      <Card>
        <CardHeader>
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Înapoi
          </button>
          <CardTitle>Introduceți parola</CardTitle>
          <CardDescription>
            Conectare ca <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
            className="space-y-6"
          >
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium">
                Parolă
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isLoading}
                  {...passwordForm.register("password")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordForm.formState.errors.password && (
                <p className="mt-1 text-sm text-destructive">
                  {passwordForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Se conectează...
                </>
              ) : (
                "Conectare"
              )}
            </Button>

            <button
              type="button"
              onClick={handleMagicLinkFallback}
              disabled={isLoading}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              Trimite-mi un link de autentificare
            </button>
          </form>
        </CardContent>
      </Card>
    );
  }

  // Email step (initial)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Autentificare</CardTitle>
        <CardDescription>Introduceți adresa de email pentru a continua</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Adresă de Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="exemplu@email.com"
                autoComplete="email"
                disabled={isLoading}
                {...emailForm.register("email")}
                className="pl-10"
              />
            </div>
            {emailForm.formState.errors.email && (
              <p className="mt-1 text-sm text-destructive">
                {emailForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Se încarcă...
              </>
            ) : (
              "Continuă"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Introduceți emailul, apoi parola pentru a vă conecta.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
