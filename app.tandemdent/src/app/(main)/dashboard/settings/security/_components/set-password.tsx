"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Eye, EyeOff, Key, Loader2, CheckCircle } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";
import { setUserPassword } from "@/lib/actions/auth.actions";

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Parola trebuie să aibă cel puțin 8 caractere." })
      .regex(/[A-Z]/, { message: "Parola trebuie să conțină cel puțin o literă mare." })
      .regex(/[a-z]/, { message: "Parola trebuie să conțină cel puțin o literă mică." })
      .regex(/[0-9]/, { message: "Parola trebuie să conțină cel puțin o cifră." }),
    confirmPassword: z.string().min(1, { message: "Confirmarea parolei este obligatorie." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Parolele nu se potrivesc.",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

interface SetPasswordProps {
  userId: string;
  userType: "admin" | "doctor" | "patient";
  hasPassword: boolean;
}

export function SetPassword({ userId, userType, hasPassword: initialHasPassword }: SetPasswordProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasPassword, setHasPassword] = useState(initialHasPassword);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: PasswordFormValues) => {
    setIsLoading(true);
    try {
      const result = await setUserPassword(userId, userType, data.password);

      if (result.success) {
        toast.success(hasPassword ? "Parolă actualizată" : "Parolă setată", {
          description: "Parola a fost salvată cu succes.",
        });
        setHasPassword(true);
        setIsEditing(false);
        form.reset();
      } else {
        toast.error("Eroare", {
          description: result.error || "Nu s-a putut seta parola.",
        });
      }
    } catch (error) {
      console.error("Set password error:", error);
      toast.error("Eroare", {
        description: "A apărut o eroare. Vă rugăm încercați din nou.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.reset();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            <CardTitle>Parolă</CardTitle>
          </div>
          {hasPassword && !isEditing && (
            <Badge variant="secondary" className="gap-1">
              <CheckCircle className="h-3 w-3" />
              Configurată
            </Badge>
          )}
        </div>
        <CardDescription>
          {hasPassword
            ? "Parola vă permite să vă autentificați rapid fără a aștepta un cod OTP."
            : "Setați o parolă pentru a vă autentifica mai rapid, fără a aștepta un cod OTP pe email."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isEditing ? (
          <Button
            variant={hasPassword ? "outline" : "default"}
            onClick={() => setIsEditing(true)}
          >
            {hasPassword ? "Schimbă parola" : "Setează o parolă"}
          </Button>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{hasPassword ? "Parolă nouă" : "Parolă"}</FormLabel>
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

              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Se salvează...
                    </>
                  ) : (
                    "Salvează parola"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
                  Anulează
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
