import { redirect } from "next/navigation";

import { getLoggedInUser } from "@/lib/actions/auth.actions";
import { DeviceManagement } from "./_components/device-management";

export default async function SecuritySettingsPage() {
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) {
    redirect("/auth/v2/login");
  }

  // Map userType for DeviceManagement component
  const userType = loggedInUser.type as "admin" | "doctor" | "patient";

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Securitate</h1>
        <p className="text-muted-foreground">
          Gestionează dispozitivele conectate și setările de securitate ale contului tău
        </p>
      </div>

      <DeviceManagement userId={loggedInUser.user.$id} userType={userType} />
    </div>
  );
}
