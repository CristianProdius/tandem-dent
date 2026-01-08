"use client";
"use no memo";

import * as React from "react";

import { Plus, Search } from "lucide-react";
import Link from "next/link";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { withDndColumn } from "@/components/data-table/table-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import type { Patient } from "@/types/appwrite.types";

import { patientColumns } from "./columns";

interface PatientsTableProps {
  patients: Patient[];
}

export function PatientsTable({ patients: initialPatients }: PatientsTableProps) {
  const [patients, setPatients] = React.useState(() => initialPatients);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const columns = withDndColumn(patientColumns);
  const table = useDataTableInstance({
    data: patients,
    columns,
    getRowId: (row) => row.$id,
  });

  // Apply global filter
  React.useEffect(() => {
    table.setGlobalFilter(globalFilter);
  }, [globalFilter, table]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Caută pacienți..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <DataTableViewOptions table={table} />
          <Button asChild size="sm">
            <Link href="/dashboard/patients/new">
              <Plus />
              <span className="hidden lg:inline">Adaugă pacient</span>
            </Link>
          </Button>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <DataTable dndEnabled table={table} columns={columns} onReorder={setPatients} />
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
