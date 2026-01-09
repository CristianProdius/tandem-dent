import { Bell, Building, Calendar, ChevronRight, Mail, Shield, Users } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Setări</h1>
        <p className="text-muted-foreground">Administrează setările clinicii și aplicației</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              <CardTitle>Informații clinică</CardTitle>
            </div>
            <CardDescription>Detalii de bază și informații de contact ale clinicii</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Nume clinică</Label>
                <p className="text-sm text-muted-foreground">TandemDent</p>
              </div>
              <div className="space-y-2">
                <Label>Email contact</Label>
                <p className="text-sm text-muted-foreground">contact@tandemdent.md</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <CardTitle>Program de lucru</CardTitle>
            </div>
            <CardDescription>Configurează orele de funcționare ale clinicii</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Ora deschidere</Label>
                <p className="text-sm text-muted-foreground">08:00</p>
              </div>
              <div className="space-y-2">
                <Label>Ora închidere</Label>
                <p className="text-sm text-muted-foreground">20:00</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Zile libere</Label>
              <p className="text-sm text-muted-foreground">Duminică</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Notificări</CardTitle>
            </div>
            <CardDescription>Configurează notificările prin email și SMS</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Confirmări programări</Label>
                <p className="text-sm text-muted-foreground">
                  Trimite emailuri de confirmare când sunt programate programările
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Memento-uri programări</Label>
                <p className="text-sm text-muted-foreground">
                  Trimite emailuri de memento cu 24 de ore înainte de programări
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificări anulare</Label>
                <p className="text-sm text-muted-foreground">
                  Trimite emailuri când programările sunt anulate
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <CardTitle>Integrare email</CardTitle>
            </div>
            <CardDescription>Configurează serviciul de trimitere emailuri</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Furnizor email</Label>
              <p className="text-sm text-muted-foreground">Resend</p>
            </div>
            <div className="space-y-2">
              <Label>Adresă expeditor</Label>
              <p className="text-sm text-muted-foreground">appointments@tandemdent.com</p>
            </div>
          </CardContent>
        </Card>

        <Link href="/dashboard/settings/security">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <CardTitle>Securitate</CardTitle>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardDescription>
                Gestionează dispozitivele conectate și setările de securitate
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <CardTitle>Portal pacienți</CardTitle>
            </div>
            <CardDescription>Configurează opțiunile de autoservire pentru pacienți</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Activează portalul pacienților</Label>
                <p className="text-sm text-muted-foreground">
                  Permite pacienților să vadă programările și istoricul
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Autentificare prin link magic</Label>
                <p className="text-sm text-muted-foreground">
                  Folosește autentificare fără parolă pentru pacienți
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
