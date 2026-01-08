"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2, Mail, ArrowLeft } from "lucide-react";

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
} from "@/lib/actions/auth.actions";

const EmailSchema = z.object({
  email: z.string().email({ message: "Vă rugăm introduceți o adresă de email validă." }),
});

const OTPSchema = z.object({
  otp: z.string().min(6, { message: "Codul OTP trebuie să aibă 6 caractere." }),
});

type Step = "email" | "otp" | "magic-link-sent";

export function LoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [adminId, setAdminId] = useState("");
  const [userId, setUserId] = useState(""); // Appwrite Auth user ID
  const [userType, setUserType] = useState<"admin" | "doctor" | null>(null);

  const emailForm = useForm<z.infer<typeof EmailSchema>>({
    resolver: zodResolver(EmailSchema),
    defaultValues: {
      email: "",
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
      // Check what type of user this email belongs to
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

      if (result.type === "admin") {
        // Admin uses OTP via Appwrite Auth
        const otpResult = await sendAdminEmailOTP(data.email);
        if (otpResult.success && otpResult.adminId) {
          setAdminId(otpResult.adminId);
          if (otpResult.userId) {
            setUserId(otpResult.userId);
          }
          setStep("otp");
          toast.success("Cod OTP trimis", {
            description: "Verificați emailul pentru codul de autentificare.",
          });
        } else if (otpResult.success && !otpResult.adminId) {
          // Email doesn't exist in admin collection
          toast.error("Email nerecunoscut", {
            description: "Acest email nu este asociat cu un cont de administrator.",
          });
        } else {
          toast.error("Eroare la trimiterea OTP", {
            description: otpResult.error || "Vă rugăm încercați din nou.",
          });
        }
      } else if (result.type === "doctor") {
        // Doctor uses magic link
        const magicLinkResult = await sendDoctorMagicLink(data.email);
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
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Eroare de autentificare", {
        description: "A apărut o eroare. Vă rugăm încercați din nou.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onOTPSubmit = async (data: z.infer<typeof OTPSchema>) => {
    setIsLoading(true);
    try {
      const result = await verifyAdminOTP(adminId, data.otp, userId);

      if (result.success) {
        toast.success("Autentificare reușită!");
        // Use hard redirect to ensure the new cookie is recognized
        window.location.href = "/dashboard/clinic";
      } else {
        toast.error("Cod OTP invalid", {
          description: result.error || "Vă rugăm încercați din nou.",
        });
        setIsLoading(false);
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
    setStep("email");
    setUserEmail("");
    setAdminId("");
    setUserId("");
    setUserType(null);
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

  // OTP verification step (for admins)
  if (step === "otp") {
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

  // Magic link sent step (for doctors)
  if (step === "magic-link-sent") {
    return (
      <div className="space-y-6">
        <button
          onClick={goBack}
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
