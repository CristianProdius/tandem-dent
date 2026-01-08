"use no memo";

import type { ColumnDef } from "@tanstack/react-table";
import { CalendarDays, CircleCheck, Clock, EllipsisVertical, User, XCircle } from "lucide-react";

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
import type { Appointment } from "@/types/appwrite.types";

const statusLabels: Record<string, string> = {
  scheduled: "Programat",
  pending: "În așteptare",
  cancelled: "Anulat",
};

export const appointmentColumns: ColumnDef<Appointment>[] = [
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
    accessorKey: "patient.name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Pacient" />,
    cell: ({ row }) => {
      const patient = row.original.patient;
      return (
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-primary/10">
            <User className="size-4 text-primary" />
          </div>
          <div>
            <div className="font-medium">{patient?.name || "Necunoscut"}</div>
            <div className="text-muted-foreground text-xs">{patient?.phone}</div>
          </div>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "schedule",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Data și ora" />,
    cell: ({ row }) => {
      const schedule = row.getValue("schedule") as Date;
      const { dateOnly, timeOnly } = formatDateTime(schedule);
      return (
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-muted-foreground" />
          <div>
            <div className="font-medium">{dateOnly}</div>
            <div className="text-muted-foreground text-xs">{timeOnly}</div>
          </div>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "primaryPhysician",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Medic" />,
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
    accessorKey: "reason",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Serviciu" />,
    cell: ({ row }) => {
      return (
        <div className="max-w-[180px] truncate text-muted-foreground">
          {row.getValue("reason")}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant="outline"
          className="px-1.5 text-muted-foreground"
        >
          {status === "scheduled" ? (
            <CircleCheck className="fill-green-500 stroke-border dark:fill-green-400" />
          ) : status === "pending" ? (
            <Clock className="fill-amber-500 stroke-border dark:fill-amber-400" />
          ) : (
            <XCircle className="fill-red-500 stroke-border dark:fill-red-400" />
          )}
          {statusLabels[status] || status}
        </Badge>
      );
    },
    enableSorting: false,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const appointment = row.original;
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
            <DropdownMenuItem>Vezi detalii</DropdownMenuItem>
            <DropdownMenuItem>Editează</DropdownMenuItem>
            <DropdownMenuSeparator />
            {appointment.status === "pending" && (
              <DropdownMenuItem className="text-emerald-600">
                Confirmă programare
              </DropdownMenuItem>
            )}
            {appointment.status !== "cancelled" && (
              <DropdownMenuItem variant="destructive">Anulează programare</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
  },
];
