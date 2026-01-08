"use client";
"use no memo";

import * as React from "react";

import { Search } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { withDndColumn } from "@/components/data-table/table-utils";
import { Input } from "@/components/ui/input";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import type { Treatment } from "@/types/appwrite.types";

import { treatmentColumns } from "./columns";

interface TreatmentsTableProps {
  treatments: Treatment[];
}

export function TreatmentsTable({ treatments: initialTreatments }: TreatmentsTableProps) {
  const [treatments, setTreatments] = React.useState(() => initialTreatments);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const columns = withDndColumn(treatmentColumns);
  const table = useDataTableInstance({
    data: treatments,
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
            placeholder="Caută tratamente..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <DataTable dndEnabled table={table} columns={columns} onReorder={setTreatments} />
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
