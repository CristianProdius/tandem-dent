"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2, Mail, ArrowLeft, Eye, EyeOff, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  checkUserTypeByEmail,
  sendAdminEmailOTP,
  verifyAdminOTP,
  sendDoctorMagicLink,
  loginWithPassword,
  verifyOTPAndLogin,
  resendOTP,
} from "@/lib/actions/auth.actions";

const EmailSchema = z.object({
  email: z.string().email({ message: "Vă rugăm introduceți o adresă de email validă." }),
});

const PasswordSchema = z.object({
  password: z.string().min(1, { message: "Vă rugăm introduceți parola." }),
});

const OTPSchema = z.object({
  otp: z.string().min(6, { message: "Codul OTP trebuie să aibă 6 caractere." }),
});

type Step = "email" | "password" | "otp" | "magic-link-sent" | "new-device-otp";

export function LoginForm() {
  const [step, setStep] = useState<Step>("email");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [adminId, setAdminId] = useState("");
  const [userId, setUserId] = useState("");
  const [userType, setUserType] = useState<"admin" | "doctor" | null>(null);

  const emailForm = useForm<z.infer<typeof EmailSchema>>({
    resolver: zodResolver(EmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const passwordForm = useForm<z.infer<typeof PasswordSchema>>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const otpForm = useForm<z.infer<typeof OTPSchema>>({
    resolver: zodResolver(OTPSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onEmailSubmit = async (data: z.infer<typeof EmailSchema>) => {
    setIsLoading(true);
    try {
      const result = await checkUserTypeByEmail(data.email);

      if (!result.exists || result.type === "patient") {
        toast.error("Email nerecunoscut", {
          description: "Acest email nu este asociat cu un cont de administrator sau medic.",
        });
        setIsLoading(false);
        return;
      }

      setUserEmail(data.email);
      setUserType(result.type as "admin" | "doctor");
      setStep("password");
    } catch (error) {
      console.error("Email check error:", error);
      toast.error("Eroare", {
        description: "A apărut o eroare. Vă rugăm încercați din nou.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data: z.infer<typeof PasswordSchema>) => {
    setIsLoading(true);
    try {
      const result = await loginWithPassword(userEmail, data.password);

      if (!result.success) {
        if (result.error?.includes("parolă setată")) {
          // User doesn't have a password, use legacy auth
          await handleLegacyAuth();
        } else {
          toast.error("Autentificare eșuată", {
            description: result.error || "Email sau parolă incorectă.",
          });
        }
        setIsLoading(false);
        return;
      }

      if (result.requiresOTP) {
        // New device detected, need OTP
        setUserId(result.userId || "");
        setStep("new-device-otp");
        toast.info("Dispozitiv nou detectat", {
          description: "Am trimis un cod de verificare pe email.",
        });
      } else {
        // Login successful
        toast.success("Autentificare reușită!");
        window.location.href = "/dashboard/clinic";
      }
    } catch (error) {
      console.error("Password login error:", error);
      toast.error("Eroare de autentificare", {
        description: "A apărut o eroare. Vă rugăm încercați din nou.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLegacyAuth = async () => {
    // Fallback to legacy OTP/magic link for users without password
    if (userType === "admin") {
      const otpResult = await sendAdminEmailOTP(userEmail);
      if (otpResult.success && otpResult.adminId) {
        setAdminId(otpResult.adminId);
        if (otpResult.userId) {
          setUserId(otpResult.userId);
        }
        setStep("otp");
        toast.success("Cod OTP trimis", {
          description: "Verificați emailul pentru codul de autentificare.",
        });
      } else {
        toast.error("Eroare la trimiterea OTP", {
          description: otpResult.error || "Vă rugăm încercați din nou.",
        });
      }
    } else if (userType === "doctor") {
      const magicLinkResult = await sendDoctorMagicLink(userEmail);
      if (magicLinkResult.success) {
        setStep("magic-link-sent");
        toast.success("Link de autentificare trimis", {
          description: "Verificați emailul pentru linkul de autentificare.",
        });
      } else {
        toast.error("Eroare la trimiterea linkului", {
          description: magicLinkResult.error || "Vă rugăm încercați din nou.",
        });
      }
    }
  };

  const onOTPSubmit = async (data: z.infer<typeof OTPSchema>) => {
    setIsLoading(true);
    try {
      if (step === "new-device-otp") {
        // Verifying OTP for new device
        const result = await verifyOTPAndLogin(userId, userType!, data.otp);
        if (result.success) {
          toast.success("Dispozitiv verificat cu succes!");
          window.location.href = "/dashboard/clinic";
        } else {
          toast.error("Cod OTP invalid", {
            description: result.error || "Vă rugăm încercați din nou.",
          });
          setIsLoading(false);
        }
      } else {
        // Legacy admin OTP verification
        const result = await verifyAdminOTP(adminId, data.otp, userId);
        if (result.success) {
          toast.success("Autentificare reușită!");
          window.location.href = "/dashboard/clinic";
        } else {
          toast.error("Cod OTP invalid", {
            description: result.error || "Vă rugăm încercați din nou.",
          });
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("Eroare de verificare", {
        description: "A apărut o eroare. Vă rugăm încercați din nou.",
      });
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      if (step === "new-device-otp") {
        const result = await resendOTP(userId, userType!);
        if (result.success) {
          toast.success("Cod OTP retrimis", {
            description: "Verificați emailul pentru noul cod.",
          });
        } else {
          toast.error("Eroare", {
            description: result.error || "Nu s-a putut retrimite codul.",
          });
        }
      } else {
        const result = await sendAdminEmailOTP(userEmail);
        if (result.success && result.adminId) {
          setAdminId(result.adminId);
          if (result.userId) {
            setUserId(result.userId);
          }
          toast.success("Cod OTP retrimis", {
            description: "Verificați emailul pentru noul cod.",
          });
        } else {
          toast.error("Eroare", {
            description: result.error || "Nu s-a putut retrimite codul.",
          });
        }
      }
    } catch (error) {
      toast.error("Eroare", {
        description: "A apărut o eroare la retrimiterea codului.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendMagicLink = async () => {
    setIsLoading(true);
    try {
      const result = await sendDoctorMagicLink(userEmail);
      if (result.success) {
        toast.success("Link retrimis", {
          description: "Verificați emailul pentru noul link de autentificare.",
        });
      } else {
        toast.error("Eroare", {
          description: result.error || "Nu s-a putut retrimite linkul.",
        });
      }
    } catch (error) {
      toast.error("Eroare", {
        description: "A apărut o eroare la retrimiterea linkului.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (step === "password") {
      setStep("email");
      setUserEmail("");
      setUserType(null);
      passwordForm.reset();
    } else if (step === "otp" || step === "new-device-otp" || step === "magic-link-sent") {
      setStep("password");
      otpForm.reset();
    }
  };

  const goToStart = () => {
    setStep("email");
    setUserEmail("");
    setAdminId("");
    setUserId("");
    setUserType(null);
    emailForm.reset();
    passwordForm.reset();
    otpForm.reset();
  };

  // Email step
  if (step === "email") {
    return (
      <Form {...emailForm}>
        <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
          <FormField
            control={emailForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresă de email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Se verifică...
              </>
            ) : (
              "Continuă"
            )}
          </Button>
        </form>
      </Form>
    );
  }

  // Password step
  if (step === "password") {
    return (
      <div className="space-y-6">
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Înapoi
        </button>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Autentificare ca <strong>{userEmail}</strong>
          </p>
        </div>

        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <FormField
              control={passwordForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parolă</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="current-password"
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Se verifică...
                </>
              ) : (
                "Autentificare"
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <button
            onClick={handleLegacyAuth}
            disabled={isLoading}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            Autentificare cu {userType === "admin" ? "cod OTP" : "link magic"}
          </button>
        </div>
      </div>
    );
  }

  // New device OTP verification
  if (step === "new-device-otp") {
    return (
      <div className="space-y-6">
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Înapoi
        </button>

        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="font-medium">Dispozitiv Nou Detectat</h3>
          <p className="text-sm text-muted-foreground">
            Am trimis un cod de verificare la <strong>{userEmail}</strong>
          </p>
          <p className="text-xs text-muted-foreground">
            Pentru siguranța contului, verificați că sunteți dvs.
          </p>
        </div>

        <Form {...otpForm}>
          <form onSubmit={otpForm.handleSubmit(onOTPSubmit)} className="space-y-4">
            <FormField
              control={otpForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      value={field.value}
                      onChange={field.onChange}
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Se verifică...
                </>
              ) : (
                "Verifică și adaugă dispozitiv"
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <button
            onClick={handleResendOTP}
            disabled={isLoading}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            Nu ați primit codul? Retrimite
          </button>
        </div>
      </div>
    );
  }

  // Legacy OTP verification step (for admins without password)
  if (step === "otp") {
    return (
      <div className="space-y-6">
        <button
          onClick={goToStart}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Înapoi
        </button>

        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium">Verificare OTP</h3>
          <p className="text-sm text-muted-foreground">
            Am trimis un cod de verificare la <strong>{userEmail}</strong>
          </p>
        </div>

        <Form {...otpForm}>
          <form onSubmit={otpForm.handleSubmit(onOTPSubmit)} className="space-y-4">
            <FormField
              control={otpForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      value={field.value}
                      onChange={field.onChange}
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Se verifică...
                </>
              ) : (
                "Verifică codul"
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <button
            onClick={handleResendOTP}
            disabled={isLoading}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            Nu ați primit codul? Retrimite
          </button>
        </div>
      </div>
    );
  }

  // Magic link sent step (for doctors without password)
  if (step === "magic-link-sent") {
    return (
      <div className="space-y-6">
        <button
          onClick={goToStart}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Înapoi
        </button>

        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="font-medium text-lg">Verificați emailul</h3>
          <p className="text-sm text-muted-foreground">
            Am trimis un link de autentificare la <strong>{userEmail}</strong>
          </p>
          <p className="text-xs text-muted-foreground">
            Linkul expiră în 15 minute. Verificați și folderul Spam dacă nu găsiți emailul.
          </p>
        </div>

        <div className="text-center">
          <button
            onClick={handleResendMagicLink}
            disabled={isLoading}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
                Se retrimite...
              </>
            ) : (
              "Nu ați primit emailul? Retrimite"
            )}
          </button>
        </div>
      </div>
    );
  }

  return null;
}
