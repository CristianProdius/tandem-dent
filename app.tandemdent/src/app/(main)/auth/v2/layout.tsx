import type { ReactNode } from "react";

import Image from "next/image";

import { Separator } from "@/components/ui/separator";
import { APP_CONFIG } from "@/config/app-config";

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main>
      <div className="grid h-dvh justify-center p-2 lg:grid-cols-2">
        <div className="relative order-2 hidden h-full rounded-3xl bg-primary lg:flex">
          <div className="absolute top-10 space-y-3 px-10 text-primary-foreground">
            <Image
              src="/logo.png"
              alt={APP_CONFIG.name}
              width={60}
              height={60}
              className="rounded-xl"
            />
            <h1 className="font-medium text-2xl">{APP_CONFIG.name}</h1>
            <p className="text-sm">Clinica dentară de încredere.</p>
          </div>

          <div className="absolute bottom-10 flex w-full justify-between px-10">
            <div className="flex-1 space-y-1 text-primary-foreground">
              <h2 className="font-medium">Bine ați venit!</h2>
              <p className="text-sm">Autentificați-vă pentru a accesa panoul de administrare și a gestiona programările.</p>
            </div>
            <Separator orientation="vertical" className="mx-3 h-auto!" />
            <div className="flex-1 space-y-1 text-primary-foreground">
              <h2 className="font-medium">Aveți nevoie de ajutor?</h2>
              <p className="text-sm">
                Contactați echipa noastră de suport pentru asistență și îndrumare.
              </p>
            </div>
          </div>
        </div>
        <div className="relative order-1 flex h-full">{children}</div>
      </div>
    </main>
  );
}
