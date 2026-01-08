"use client";

import * as React from "react";

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { CircleCheck, Clock, MoreHorizontal, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";
import type { Appointment } from "@/types/appwrite.types";

interface RecentAppointmentsTableProps {
  appointments: Appointment[];
}

const statusLabels: Record<string, string> = {
  scheduled: "Programat",
  pending: "În așteptare",
  cancelled: "Anulat",
};

const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "patient.name",
    header: "Pacient",
    cell: ({ row }) => {
      const patient = row.original.patient;
      return (
        <div>
          <div className="font-medium">{patient?.name || "Necunoscut"}</div>
          <div className="text-muted-foreground text-sm">{patient?.email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "schedule",
    header: "Data și ora",
    cell: ({ row }) => {
      const schedule = row.getValue("schedule") as Date;
      const { dateOnly, timeOnly } = formatDateTime(schedule);
      return (
        <div>
          <div className="font-medium">{dateOnly}</div>
          <div className="text-muted-foreground text-sm">{timeOnly}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "primaryPhysician",
    header: "Medic",
    cell: ({ row }) => {
      return <div>{row.getValue("primaryPhysician")}</div>;
    },
  },
  {
    accessorKey: "reason",
    header: "Serviciu",
    cell: ({ row }) => {
      return <div className="max-w-[200px] truncate">{row.getValue("reason")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant="outline"
          className={
            status === "scheduled"
              ? "text-emerald-600 border-emerald-200 bg-emerald-50"
              : status === "pending"
                ? "text-amber-600 border-amber-200 bg-amber-50"
                : "text-red-600 border-red-200 bg-red-50"
          }
        >
          {status === "scheduled" ? (
            <CircleCheck className="mr-1 size-3" />
          ) : status === "pending" ? (
            <Clock className="mr-1 size-3" />
          ) : (
            <XCircle className="mr-1 size-3" />
          )}
          {statusLabels[status] || status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Deschide meniu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(appointment.$id)}
            >
              Copiază ID
            </DropdownMenuItem>
            <DropdownMenuItem>Vezi detalii</DropdownMenuItem>
            <DropdownMenuItem>Editează programare</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function RecentAppointmentsTable({ appointments }: RecentAppointmentsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: appointments,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Programări recente</CardTitle>
        <CardDescription>
          Ultimele programări de la toți medicii
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Nicio programare găsită.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-muted-foreground flex-1 text-sm">
            {table.getFilteredRowModel().rows.length} programare(programări) în total.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Următor
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
