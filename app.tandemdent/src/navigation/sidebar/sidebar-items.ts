import {
  Banknote,
  Briefcase,
  Calendar,
  ClipboardList,
  LayoutDashboard,
  type LucideIcon,
  Settings,
  Stethoscope,
  UserCog,
  Users,
} from "lucide-react";

import type { UserRole } from "@/types/appwrite.types";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
  allowedRoles?: UserRole[];
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
  allowedRoles?: UserRole[];
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
  allowedRoles?: UserRole[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Panouri de control",
    items: [
      {
        title: "Prezentare generală",
        url: "/dashboard/clinic",
        icon: LayoutDashboard,
        // Available to all roles
      },
      {
        title: "Pacienți",
        url: "/dashboard/patients",
        icon: Users,
        // Available to all roles
      },
      {
        title: "Facturare",
        url: "/dashboard/billing",
        icon: Banknote,
        allowedRoles: ["admin"], // Only admins can see billing
      },
    ],
  },
  {
    id: 2,
    label: "Operațiuni",
    items: [
      {
        title: "Programări",
        url: "/dashboard/appointments",
        icon: Calendar,
        // Available to all roles
      },
      {
        title: "Tratamente",
        url: "/dashboard/treatments",
        icon: Stethoscope,
        // Available to all roles
      },
    ],
  },
  {
    id: 3,
    label: "Administrare",
    allowedRoles: ["admin"], // Entire group is admin-only
    items: [
      {
        title: "Medici",
        url: "/dashboard/doctors",
        icon: UserCog,
        allowedRoles: ["admin"],
      },
      {
        title: "Servicii",
        url: "/dashboard/services",
        icon: Briefcase,
        allowedRoles: ["admin"],
      },
      {
        title: "Setări",
        url: "/dashboard/settings",
        icon: Settings,
        allowedRoles: ["admin"],
      },
    ],
  },
];
