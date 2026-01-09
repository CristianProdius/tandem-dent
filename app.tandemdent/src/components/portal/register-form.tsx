"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Loader2,
  Mail,
  ArrowLeft,
  Eye,
  EyeOff,
  User,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  Heart,
  Shield,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";
import {
  registerPatientWithPassword,
  verifyRegistrationOTP,
  resendOTP,
} from "@/lib/actions/auth.actions";

const FormSchema = z
  .object({
    // Basic info
    name: z.string().min(2, { message: "Numele trebuie să aibă cel puțin 2 caractere." }),
    email: z.string().email({ message: "Vă rugăm introduceți o adresă de email validă." }),
    phone: z.string().min(10, { message: "Numărul de telefon trebuie să aibă cel puțin 10 cifre." }),
    birthDate: z.string().min(1, { message: "Data nașterii este obligatorie." }),
    gender: z.enum(["male", "female", "other"], { required_error: "Vă rugăm selectați genul." }),
    address: z.string().min(5, { message: "Adresa trebuie să aibă cel puțin 5 caractere." }),
    occupation: z.string().min(2, { message: "Ocupația trebuie să aibă cel puțin 2 caractere." }),

    // Emergency contact
    emergencyContactName: z.string().min(2, { message: "Numele contactului de urgență este obligatoriu." }),
    emergencyContactNumber: z.string().min(10, { message: "Numărul contactului de urgență este obligatoriu." }),

    // Optional medical info
    primaryPhysician: z.string().optional(),
    insuranceProvider: z.string().optional(),
    insurancePolicyNumber: z.string().optional(),
    allergies: z.string().optional(),
    currentMedication: z.string().optional(),
    familyMedicalHistory: z.string().optional(),
    pastMedicalHistory: z.string().optional(),

    // Privacy and password
    privacyConsent: z.boolean().refine((val) => val === true, {
      message: "Trebuie să acceptați termenii și condițiile.",
    }),
    password: z
      .string()
      .min(8, { message: "Parola trebuie să aibă cel puțin 8 caractere." })
      .regex(/[A-Z]/, { message: "Parola trebuie să conțină cel puțin o literă mare." })
      .regex(/[a-z]/, { message: "Parola trebuie să conțină cel puțin o literă mică." })
      .regex(/[0-9]/, { message: "Parola trebuie să conțină cel puțin o cifră." }),
    confirmPassword: z.string().min(8, { message: "Confirmarea parolei este obligatorie." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Parolele nu se potrivesc.",
    path: ["confirmPassword"],
  });

const OTPSchema = z.object({
  otp: z.string().min(6, { message: "Codul OTP trebuie să aibă 6 caractere." }),
});

type Step = "personal" | "medical" | "password" | "otp";

export function PatientRegisterForm() {
  const [step, setStep] = useState<Step>("personal");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      birthDate: "",
      gender: undefined,
      address: "",
      occupation: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
      primaryPhysician: "",
      insuranceProvider: "",
      insurancePolicyNumber: "",
      allergies: "",
      currentMedication: "",
      familyMedicalHistory: "",
      pastMedicalHistory: "",
      privacyConsent: false,
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

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    try {
      const result = await registerPatientWithPassword({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        birthDate: new Date(data.birthDate),
        gender: data.gender,
        address: data.address,
        occupation: data.occupation,
        emergencyContactName: data.emergencyContactName,
        emergencyContactNumber: data.emergencyContactNumber,
        primaryPhysician: data.primaryPhysician,
        insuranceProvider: data.insuranceProvider,
        insurancePolicyNumber: data.insurancePolicyNumber,
        allergies: data.allergies,
        currentMedication: data.currentMedication,
        familyMedicalHistory: data.familyMedicalHistory,
        pastMedicalHistory: data.pastMedicalHistory,
        privacyConsent: data.privacyConsent,
      });

      if (result.success) {
        setUserId(result.userId || "");
        setUserEmail(data.email);

        if (result.requiresOTP) {
          setStep("otp");
          toast.success("Cont creat cu succes!", {
            description: "Verificați emailul pentru codul de confirmare.",
          });
        } else {
          toast.success("Înregistrare reușită!", {
            description: "Puteți acum să vă autentificați.",
          });
          window.location.href = "/portal";
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
      const result = await verifyRegistrationOTP(userId, "patient", data.otp);

      if (result.success) {
        toast.success("Email verificat cu succes!");
        window.location.href = "/portal/dashboard";
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
      const result = await resendOTP(userId, "patient");
      if (result.success) {
        toast.success("Cod OTP retrimis", {
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

  const goBack = () => {
    if (step === "otp") {
      setStep("password");
      otpForm.reset();
    } else if (step === "password") {
      setStep("medical");
    } else if (step === "medical") {
      setStep("personal");
    }
  };

  const goToNextStep = async () => {
    if (step === "personal") {
      // Validate personal fields
      const personalValid = await form.trigger([
        "name",
        "email",
        "phone",
        "birthDate",
        "gender",
        "address",
        "occupation",
        "emergencyContactName",
        "emergencyContactNumber",
      ]);
      if (personalValid) {
        setStep("medical");
      }
    } else if (step === "medical") {
      setStep("password");
    }
  };

  // Step indicators
  const steps = [
    { id: "personal", label: "Date personale", icon: User },
    { id: "medical", label: "Informații medicale", icon: Heart },
    { id: "password", label: "Securitate", icon: Shield },
  ];

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

  return (
    <div className="space-y-6">
      {/* Step indicators */}
      <div className="flex items-center justify-between">
        {steps.map((s, index) => {
          const Icon = s.icon;
          const isActive = step === s.id;
          const isPast =
            (step === "medical" && s.id === "personal") ||
            (step === "password" && (s.id === "personal" || s.id === "medical"));

          return (
            <div key={s.id} className="flex items-center">
              <div
                className={`flex items-center gap-2 ${
                  isActive
                    ? "text-primary"
                    : isPast
                    ? "text-emerald-600"
                    : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isPast
                      ? "bg-emerald-600 text-white"
                      : "bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className="hidden sm:inline text-sm font-medium">{s.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 sm:w-16 h-0.5 mx-2 ${
                    isPast ? "bg-emerald-600" : "bg-muted"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Personal Information Step */}
          {step === "personal" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nume complet</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Ion Popescu"
                            autoComplete="name"
                            disabled={isLoading}
                            className="pl-10"
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            disabled={isLoading}
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefon</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="tel"
                            placeholder="+373 XX XXX XXX"
                            autoComplete="tel"
                            disabled={isLoading}
                            className="pl-10"
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
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data nașterii</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="date"
                            disabled={isLoading}
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gen</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selectați genul" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Masculin</SelectItem>
                          <SelectItem value="female">Feminin</SelectItem>
                          <SelectItem value="other">Altul</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ocupație</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Inginer software"
                            disabled={isLoading}
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresă</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea
                          placeholder="Strada, număr, bloc, apartament, oraș"
                          disabled={isLoading}
                          className="pl-10 min-h-[80px]"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-4">Contact de urgență</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="emergencyContactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nume contact urgență</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Maria Popescu"
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
                    name="emergencyContactNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefon contact urgență</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+373 XX XXX XXX"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button type="button" className="w-full" onClick={goToNextStep}>
                Continuă
              </Button>
            </>
          )}

          {/* Medical Information Step */}
          {step === "medical" && (
            <>
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Înapoi
              </button>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="primaryPhysician"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medic de familie (opțional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Dr. Ion Ionescu"
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
                  name="insuranceProvider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Furnizor asigurare (opțional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="CNAS"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="insurancePolicyNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Număr poliță asigurare (opțional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Număr poliță"
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
                name="allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alergii cunoscute (opțional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Listați alergiile cunoscute (medicamente, substanțe, etc.)"
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
                name="currentMedication"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medicație curentă (opțional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Listați medicamentele pe care le luați în prezent"
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
                name="familyMedicalHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Istoric medical familial (opțional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Condiții medicale în familie"
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
                name="pastMedicalHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Istoric medical personal (opțional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Condiții medicale anterioare, operații, etc."
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="button" className="w-full" onClick={goToNextStep}>
                Continuă
              </Button>
            </>
          )}

          {/* Password Step */}
          {step === "password" && (
            <>
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Înapoi
              </button>

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

              <FormField
                control={form.control}
                name="privacyConsent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Accept termenii și condițiile
                      </FormLabel>
                      <FormDescription>
                        Sunt de acord cu prelucrarea datelor mele personale și medicale
                        conform politicii de confidențialitate.
                      </FormDescription>
                    </div>
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
                  "Finalizează înregistrarea"
                )}
              </Button>
            </>
          )}
        </form>
      </Form>
    </div>
  );
}
