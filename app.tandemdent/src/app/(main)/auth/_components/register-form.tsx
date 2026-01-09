"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2, Mail, ArrowLeft, Eye, EyeOff, UserCog, Stethoscope } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  registerAdmin,
  registerDoctor,
  verifyRegistrationOTP,
  resendOTP,
} from "@/lib/actions/auth.actions";

const FormSchema = z
  .object({
    role: z.enum(["admin", "doctor"], { required_error: "Vă rugăm selectați un rol." }),
    name: z.string().min(2, { message: "Numele trebuie să aibă cel puțin 2 caractere." }),
    email: z.string().email({ message: "Vă rugăm introduceți o adresă de email validă." }),
    phone: z.string().optional(),
    specialty: z.string().optional(),
    password: z
      .string()
      .min(8, { message: "Parola trebuie să aibă cel puțin 8 caractere." })
      .regex(/[A-Z]/, { message: "Parola trebuie să conțină cel puțin o literă mare." })
      .regex(/[a-z]/, { message: "Parola trebuie să conțină cel puțin o literă mică." })
      .regex(/[0-9]/, { message: "Parola trebuie să conțină cel puțin o cifră." }),
    confirmPassword: z.string().min(8, { message: "Confirmarea parolei trebuie să aibă cel puțin 8 caractere." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Parolele nu se potrivesc.",
    path: ["confirmPassword"],
  });

const OTPSchema = z.object({
  otp: z.string().min(6, { message: "Codul OTP trebuie să aibă 6 caractere." }),
});

type Step = "form" | "otp";

export function RegisterForm() {
  const [step, setStep] = useState<Step>("form");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userId, setUserId] = useState("");
  const [userType, setUserType] = useState<"admin" | "doctor">("admin");
  const [userEmail, setUserEmail] = useState("");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      role: "admin",
      name: "",
      email: "",
      phone: "",
      specialty: "",
      password: "",
      confirmPassword: "",
    },
  });

  const otpForm = useForm<z.infer<typeof OTPSchema>>({
    resolver: zodResolver(OTPSchema),
    defaultValues: {
      otp: "",
    },
  });

  const watchedRole = form.watch("role");

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    try {
      let result;

      if (data.role === "admin") {
        result = await registerAdmin({
          name: data.name,
          email: data.email,
          password: data.password,
          phone: data.phone,
        });
      } else {
        result = await registerDoctor({
          name: data.name,
          email: data.email,
          password: data.password,
          phone: data.phone,
          specialty: data.specialty,
        });
      }

      if (result.success) {
        setUserId(result.userId || "");
        setUserType(data.role);
        setUserEmail(data.email);

        if (result.requiresOTP) {
          setStep("otp");
          toast.success("Cont creat cu succes!", {
            description: "Verificați emailul pentru codul de confirmare.",
          });
        } else {
          // Shouldn't happen, but handle it
          toast.success("Înregistrare reușită!", {
            description: "Puteți acum să vă autentificați.",
          });
          window.location.href = "/auth/v2/login";
        }
      } else {
        toast.error("Eroare la înregistrare", {
          description: result.error || "Vă rugăm încercați din nou.",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Eroare de înregistrare", {
        description: "A apărut o eroare. Vă rugăm încercați din nou.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onOTPSubmit = async (data: z.infer<typeof OTPSchema>) => {
    setIsLoading(true);
    try {
      const result = await verifyRegistrationOTP(userId, userType, data.otp);

      if (result.success) {
        toast.success("Email verificat cu succes!");
        // Redirect based on user type
        const redirectUrl = userType === "admin" || userType === "doctor"
          ? "/dashboard/clinic"
          : "/portal/dashboard";
        window.location.href = redirectUrl;
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
      const result = await resendOTP(userId, userType);
      if (result.success) {
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

  const goBack = () => {
    setStep("form");
    otpForm.reset();
  };

  // OTP verification step
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
          <h3 className="font-medium">Verificare Email</h3>
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

  // Registration form
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tip cont</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectați tipul de cont" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <UserCog className="h-4 w-4" />
                      <span>Administrator</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="doctor">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4" />
                      <span>Medic</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nume complet</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ion Popescu"
                  autoComplete="name"
                  disabled={isLoading}
                  {...field}
                />
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
                <Input
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

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefon (opțional)</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="+373 XX XXX XXX"
                  autoComplete="tel"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchedRole === "doctor" && (
          <FormField
            control={form.control}
            name="specialty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specialitate</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ex: Stomatologie generală"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

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

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Se înregistrează...
            </>
          ) : (
            "Înregistrare"
          )}
        </Button>
      </form>
    </Form>
  );
}
