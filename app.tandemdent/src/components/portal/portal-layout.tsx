"use client";

import { LogOut, Phone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { logoutPatient } from "@/lib/actions/auth.actions";

interface PortalLayoutProps {
  children: React.ReactNode;
  patientName?: string;
}

export function PortalLayout({ children, patientName }: PortalLayoutProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutPatient();
    router.push("/portal");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4 sm:px-6 lg:px-8">
          <Link href="/portal/dashboard" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">TandemDent</span>
            <span className="text-sm text-muted-foreground">| Patient Portal</span>
          </Link>

          {patientName && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Hello, <span className="font-medium text-foreground">{patientName}</span>
              </span>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="gap-1"
              >
                <LogOut className="size-3.5" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
          <p className="inline-flex items-center gap-2">
            <Phone className="size-4" />
            Have questions? Contact us at{" "}
            <a href="tel:+12345678900" className="font-medium text-primary hover:underline">
              +1 234 567 8900
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
