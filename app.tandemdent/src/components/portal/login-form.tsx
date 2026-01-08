"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { sendPatientMagicLink } from "@/lib/actions/auth.actions";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      await sendPatientMagicLink(data.email);
      setIsSuccess(true);
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-500/20">
            <CheckCircle className="size-8 text-emerald-600" />
          </div>
          <h2 className="mb-2 text-xl font-semibold">
            Check your email
          </h2>
          <p className="text-muted-foreground">
            We&apos;ve sent you a login link. Check your email inbox and
            click the link to access the portal.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            The link expires in 15 minutes.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your email to receive a magic link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                {...register("email")}
                className="pl-10"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 border border-destructive/20">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Sending..." : "Send Login Link"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            You will receive an email with a link to access the portal.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
