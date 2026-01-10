import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  CheckCircle,
  Mail,
  MoreHorizontal,
  Plus,
  Shield,
  UserCog,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getLoggedInUser } from "@/lib/actions/auth.actions";
import { getAdmins } from "@/lib/actions/admin.actions";
import { AdminActions } from "./_components/admin-actions";

export default async function AdminsPage() {
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser || loggedInUser.type !== "admin") {
    redirect("/auth/v2/login");
  }

  const admins = await getAdmins();

  // Separate active and pending admins
  const activeAdmins = admins.filter(
    (admin) => (admin as any).inviteStatus !== "pending"
  );
  const pendingAdmins = admins.filter(
    (admin) => (admin as any).inviteStatus === "pending"
  );

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Administratori</h1>
          <p className="text-muted-foreground">
            Gestionează echipa de administratori ai clinicii
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/admins/invite">
            <Plus className="mr-2 h-4 w-4" />
            Invită administrator
          </Link>
        </Button>
      </div>

      {/* Pending Invitations */}
      {pendingAdmins.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            Invitații în așteptare
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendingAdmins.map((admin) => (
              <Card key={admin.$id} className="border-amber-200 bg-amber-50/50">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                        <Mail className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{admin.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {admin.email}
                        </p>
                      </div>
                    </div>
                    <AdminActions
                      adminId={admin.$id}
                      isPending={true}
                      currentUserName={loggedInUser.user.name}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="text-amber-600 border-amber-300">
                    <Clock className="mr-1 h-3 w-3" />
                    Invitație trimisă
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Active Admins */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-emerald-500" />
          Administratori activi
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activeAdmins.length > 0 ? (
            activeAdmins.map((admin) => (
              <Card key={admin.$id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {admin.name}
                          {admin.$id === loggedInUser.user.$id && (
                            <Badge variant="secondary" className="text-xs">
                              Tu
                            </Badge>
                          )}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {admin.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-emerald-600 border-emerald-300"
                    >
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Activ
                    </Badge>
                    {(admin as any).passwordHash && (
                      <Badge variant="secondary" className="text-xs">
                        Parolă setată
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-10">
                <UserCog className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">
                  Niciun administrator activ
                </h3>
                <p className="text-sm text-muted-foreground">
                  Invitați primul administrator pentru a începe.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
