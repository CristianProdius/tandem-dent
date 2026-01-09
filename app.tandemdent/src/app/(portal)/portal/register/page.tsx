import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PatientRegisterForm } from "@/components/portal/register-form";
import { getPatientSession } from "@/lib/actions/auth.actions";

export default async function PortalRegisterPage() {
  // Redirect if already logged in
  const session = await getPatientSession();
  if (session) {
    redirect("/portal/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Logo Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary">TandemDent</h1>
          <p className="mt-2 text-muted-foreground">Portal Pacient - Înregistrare</p>
        </div>

        {/* Registration Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Creează un cont</CardTitle>
            <CardDescription>
              Completați formularul pentru a vă înregistra în portalul pacienților
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PatientRegisterForm />
          </CardContent>
        </Card>

        {/* Links */}
        <div className="flex flex-col gap-4 text-center">
          <p className="text-sm text-muted-foreground">
            Aveți deja un cont?{" "}
            <Link
              href="/portal"
              className="text-primary hover:underline font-medium"
            >
              Autentificați-vă
            </Link>
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="size-4" />
            Înapoi acasă
          </Link>
        </div>
      </div>
    </div>
  );
}
