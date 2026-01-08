import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { verifyDoctorMagicLink } from "@/lib/actions/auth.actions";

interface VerifyPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function DoctorVerifyPage({ searchParams }: VerifyPageProps) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-destructive/10">
              <svg
                className="size-8 text-destructive"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="mb-2 text-xl font-semibold">
              Link invalid
            </h1>
            <p className="mb-6 text-muted-foreground">
              Linkul de autentificare este invalid sau lipsește.
            </p>
            <Button asChild>
              <Link href="/auth/v2/login">
                Încearcă din nou
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const result = await verifyDoctorMagicLink(token);

  if (!result.success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-destructive/10">
              <svg
                className="size-8 text-destructive"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="mb-2 text-xl font-semibold">
              {result.error || "Eroare de verificare"}
            </h1>
            <p className="mb-6 text-muted-foreground">
              Linkul de autentificare este invalid sau a expirat.
            </p>
            <Button asChild>
              <Link href="/auth/v2/login">
                Încearcă din nou
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success - redirect to dashboard
  redirect("/dashboard/clinic");
}
