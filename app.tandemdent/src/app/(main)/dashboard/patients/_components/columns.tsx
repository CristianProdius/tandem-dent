"use no memo";

import type { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical, Mail, Phone, User } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { formatDateTime } from "@/lib/utils";
import type { Patient } from "@/types/appwrite.types";

export const patientColumns: ColumnDef<Patient>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Selectează tot"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Selectează rând"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Pacient" />,
    cell: ({ row }) => {
      const patient = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-primary/10">
            <User className="size-4 text-primary" />
          </div>
          <div>
            <Link
              href={`/dashboard/patients/${patient.$id}`}
              className="font-medium hover:underline"
            >
              {patient.name}
            </Link>
            {patient.birthDate && (
              <div className="text-muted-foreground text-xs">
                {new Date().getFullYear() - new Date(patient.birthDate).getFullYear()} ani
              </div>
            )}
          </div>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return (
        <div className="flex items-center gap-2">
          <Mail className="size-4 text-muted-foreground" />
          <span className="max-w-[180px] truncate">{email || "-"}</span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Telefon" />,
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string;
      return (
        <div className="flex items-center gap-2">
          <Phone className="size-4 text-muted-foreground" />
          <span>{phone || "-"}</span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "primaryPhysician",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Medic principal" />,
    cell: ({ row }) => {
      const physician = row.getValue("primaryPhysician") as string;
      return physician ? (
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {physician}
        </Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "$createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Înregistrat" />,
    cell: ({ row }) => {
      const date = row.getValue("$createdAt") as string;
      const { dateOnly } = formatDateTime(date);
      return <div className="text-muted-foreground">{dateOnly}</div>;
    },
    enableSorting: true,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const patient = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
              size="icon"
            >
              <EllipsisVertical />
              <span className="sr-only">Deschide meniu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/patients/${patient.$id}`}>Vezi profil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Editează pacient</DropdownMenuItem>
            <DropdownMenuItem>Vezi programări</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Programează</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Șterge</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
  },
];
