import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/portal/login-form";
import { getPatientSession } from "@/lib/actions/auth.actions";

export default async function PortalLoginPage() {
  // Redirect if already logged in
  const session = await getPatientSession();
  if (session) {
    redirect("/portal/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Logo Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary">TandemDent</h1>
          <p className="mt-2 text-muted-foreground">Patient Portal</p>
        </div>

        {/* Login Card */}
        <div className="mb-6">
          <LoginForm />
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
