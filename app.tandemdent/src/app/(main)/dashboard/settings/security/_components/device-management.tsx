"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Trash2,
  Shield,
  Loader2,
  CheckCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { getKnownDevices, removeUserDevice } from "@/lib/actions/auth.actions";
import type { DeviceFingerprint } from "@/lib/utils/password";

interface DeviceManagementProps {
  userId: string;
  userType: "admin" | "doctor" | "patient";
}

function getDeviceIcon(userAgent: string) {
  const ua = userAgent.toLowerCase();
  if (ua.includes("mobile") || ua.includes("iphone") || ua.includes("android")) {
    return Smartphone;
  }
  if (ua.includes("tablet") || ua.includes("ipad")) {
    return Tablet;
  }
  return Monitor;
}

function getDeviceName(userAgent: string): string {
  const ua = userAgent.toLowerCase();

  // Browser detection
  let browser = "Browser necunoscut";
  if (ua.includes("chrome") && !ua.includes("edg")) {
    browser = "Chrome";
  } else if (ua.includes("firefox")) {
    browser = "Firefox";
  } else if (ua.includes("safari") && !ua.includes("chrome")) {
    browser = "Safari";
  } else if (ua.includes("edg")) {
    browser = "Edge";
  } else if (ua.includes("opera") || ua.includes("opr")) {
    browser = "Opera";
  }

  // OS detection
  let os = "";
  if (ua.includes("windows")) {
    os = "Windows";
  } else if (ua.includes("macintosh") || ua.includes("mac os")) {
    os = "macOS";
  } else if (ua.includes("linux") && !ua.includes("android")) {
    os = "Linux";
  } else if (ua.includes("android")) {
    os = "Android";
  } else if (ua.includes("iphone") || ua.includes("ipad")) {
    os = "iOS";
  }

  return os ? `${browser} pe ${os}` : browser;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isCurrentDevice(deviceId: string): boolean {
  // We can't definitively know the current device ID on the client
  // but we can check the session storage or cookies if needed
  // For now, we'll mark devices used very recently as potentially current
  return false;
}

export function DeviceManagement({ userId, userType }: DeviceManagementProps) {
  const [devices, setDevices] = useState<DeviceFingerprint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingDeviceId, setRemovingDeviceId] = useState<string | null>(null);

  const loadDevices = async () => {
    try {
      const result = await getKnownDevices(userId, userType);
      setDevices(result);
    } catch (error) {
      console.error("Failed to load devices:", error);
      toast.error("Eroare la încărcarea dispozitivelor");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDevices();
  }, [userId, userType]);

  const handleRemoveDevice = async (deviceId: string) => {
    setRemovingDeviceId(deviceId);
    try {
      const success = await removeUserDevice(userId, userType, deviceId);
      if (success) {
        setDevices(devices.filter((d) => d.id !== deviceId));
        toast.success("Dispozitiv eliminat", {
          description: "Dispozitivul a fost revocat cu succes.",
        });
      } else {
        toast.error("Eroare", {
          description: "Nu s-a putut elimina dispozitivul.",
        });
      }
    } catch (error) {
      console.error("Failed to remove device:", error);
      toast.error("Eroare", {
        description: "A apărut o eroare la eliminarea dispozitivului.",
      });
    } finally {
      setRemovingDeviceId(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Dispozitive conectate</CardTitle>
          </div>
          <CardDescription>
            Se încarcă dispozitivele...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          <CardTitle>Dispozitive conectate</CardTitle>
        </div>
        <CardDescription>
          Acestea sunt dispozitivele de pe care v-ați autentificat. Puteți revoca
          accesul oricărui dispozitiv necunoscut.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {devices.length === 0 ? (
          <div className="text-center py-8">
            <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Nu există dispozitive înregistrate.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Dispozitivele vor apărea aici după autentificare.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {devices.map((device) => {
              const DeviceIcon = getDeviceIcon(device.userAgent);
              const deviceName = getDeviceName(device.userAgent);
              const isCurrent = isCurrentDevice(device.id);

              return (
                <div
                  key={device.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <DeviceIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{deviceName}</p>
                        {device.trusted && (
                          <Badge variant="secondary" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Verificat
                          </Badge>
                        )}
                        {isCurrent && (
                          <Badge variant="default" className="gap-1">
                            Dispozitiv curent
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-muted-foreground">
                        <span>IP: {device.ipAddress}</span>
                        <span>Ultima activitate: {formatDate(device.lastUsedAt)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Adăugat: {formatDate(device.createdAt)}
                      </p>
                    </div>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        disabled={removingDeviceId === device.id}
                      >
                        {removingDeviceId === device.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Revocă accesul dispozitivului?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Dacă eliminați acest dispozitiv, va trebui să verificați din nou
                          prin cod OTP data viitoare când vă autentificați de pe el.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Anulează</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRemoveDevice(device.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Revocă accesul
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
