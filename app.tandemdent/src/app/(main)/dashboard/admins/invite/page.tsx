import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getLoggedInUser } from "@/lib/actions/auth.actions";
import { InviteAdminForm } from "./_components/invite-admin-form";

export default async function InviteAdminPage() {
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser || loggedInUser.type !== "admin") {
    redirect("/auth/v2/login");
  }

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/admins">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Invită administrator
          </h1>
          <p className="text-muted-foreground">
            Trimite o invitație pentru un nou administrator
          </p>
        </div>
      </div>

      <InviteAdminForm inviterName={loggedInUser.user.name} />
    </div>
  );
}
