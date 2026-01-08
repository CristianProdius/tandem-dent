"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center space-y-2 text-center">
      <h1 className="font-semibold text-2xl">Pagină negăsită.</h1>
      <p className="text-muted-foreground">Pagina pe care o căutați nu a fost găsită.</p>
      <Link prefetch={false} replace href="/dashboard/default">
        <Button variant="outline">Înapoi acasă</Button>
      </Link>
    </div>
  );
}
