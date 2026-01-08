"use client";

import Image from "next/image";
import Link from "next/link";

import { CircleHelp, ClipboardList, Database, File, Search, Settings } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { APP_CONFIG } from "@/config/app-config";
import { sidebarItems } from "@/navigation/sidebar/sidebar-items";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";
import type { UserRole } from "@/types/appwrite.types";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

export type SidebarUser = {
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
};

const _data = {
  navSecondary: [
    {
      title: "Setări",
      url: "#",
      icon: Settings,
    },
    {
      title: "Obține ajutor",
      url: "#",
      icon: CircleHelp,
    },
    {
      title: "Căutare",
      url: "#",
      icon: Search,
    },
  ],
  documents: [
    {
      name: "Bibliotecă de date",
      url: "#",
      icon: Database,
    },
    {
      name: "Rapoarte",
      url: "#",
      icon: ClipboardList,
    },
    {
      name: "Asistent documente",
      url: "#",
      icon: File,
    },
  ],
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: SidebarUser;
};

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const { sidebarVariant, sidebarCollapsible, isSynced } = usePreferencesStore(
    useShallow((s) => ({
      sidebarVariant: s.sidebarVariant,
      sidebarCollapsible: s.sidebarCollapsible,
      isSynced: s.isSynced,
    })),
  );

  const variant = isSynced ? sidebarVariant : props.variant;
  const collapsible = isSynced ? sidebarCollapsible : props.collapsible;

  // Filter sidebar groups and items based on user role
  const filteredItems = sidebarItems
    .filter((group) => {
      // If no allowedRoles specified at group level, show to everyone
      if (!group.allowedRoles) return true;
      // Otherwise, check if user's role is allowed
      return group.allowedRoles.includes(user.role);
    })
    .map((group) => ({
      ...group,
      // Also filter items within each group
      items: group.items.filter((item) => {
        if (!item.allowedRoles) return true;
        return item.allowedRoles.includes(user.role);
      }),
    }))
    // Remove empty groups
    .filter((group) => group.items.length > 0);

  return (
    <Sidebar {...props} variant={variant} collapsible={collapsible}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link prefetch={false} href="/dashboard/clinic">
                <Image
                  src="/logo.png"
                  alt="TandemDent"
                  width={24}
                  height={24}
                  className="rounded"
                />
                <span className="font-semibold text-base">{APP_CONFIG.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredItems} />
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
