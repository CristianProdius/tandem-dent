"use no memo";

import type { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, Clock, EllipsisVertical, Loader } from "lucide-react";

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
import { TOOTH_CONDITIONS, TREATMENT_TYPES } from "@/constants/dental";
import { formatDateTime } from "@/lib/utils";
import type { Treatment } from "@/types/appwrite.types";

export const treatmentColumns: ColumnDef<Treatment>[] = [
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
    accessorKey: "toothNumber",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Dinte" />,
    cell: ({ row }) => {
      return (
        <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 font-mono font-medium text-primary">
          {row.getValue("toothNumber")}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "condition",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Condiție" />,
    cell: ({ row }) => {
      const condition = row.getValue("condition") as keyof typeof TOOTH_CONDITIONS;
      const conditionInfo = TOOTH_CONDITIONS[condition];
      return (
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {conditionInfo?.label || condition}
        </Badge>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "treatment",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tratament" />,
    cell: ({ row }) => {
      const treatment = row.getValue("treatment") as keyof typeof TREATMENT_TYPES;
      const treatmentInfo = TREATMENT_TYPES[treatment];
      return <div className="max-w-[180px] truncate">{treatmentInfo?.label || treatment}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "doctorName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Medic" />,
    cell: ({ row }) => {
      const doctorName = row.getValue("doctorName") as string;
      return doctorName ? (
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {doctorName}
        </Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Data" />,
    cell: ({ row }) => {
      const date = row.getValue("date") as string;
      const { dateOnly } = formatDateTime(date);
      return <div className="text-muted-foreground">{dateOnly}</div>;
    },
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {status === "done" ? (
            <CheckCircle className="fill-green-500 stroke-border dark:fill-green-400" />
          ) : status === "in_progress" ? (
            <Loader className="fill-blue-500 stroke-border dark:fill-blue-400" />
          ) : (
            <Clock className="fill-amber-500 stroke-border dark:fill-amber-400" />
          )}
          {status === "done" ? "Finalizat" : status === "in_progress" ? "În desfășurare" : "În așteptare"}
        </Badge>
      );
    },
    enableSorting: false,
  },
  {
    id: "actions",
    cell: () => {
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
            <DropdownMenuItem>Actualizează status</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Vezi pacient</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Șterge</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
  },
];
