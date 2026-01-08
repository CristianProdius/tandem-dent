"use client";

import { CheckCircle, Clock, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusConfig = {
  scheduled: {
    label: "Scheduled",
    variant: "default" as const,
    className: "bg-emerald-500/10 text-emerald-700 border-emerald-200 hover:bg-emerald-500/20",
    Icon: CheckCircle,
  },
  pending: {
    label: "Pending",
    variant: "secondary" as const,
    className: "bg-amber-500/10 text-amber-700 border-amber-200 hover:bg-amber-500/20",
    Icon: Clock,
  },
  cancelled: {
    label: "Cancelled",
    variant: "destructive" as const,
    className: "bg-red-500/10 text-red-700 border-red-200 hover:bg-red-500/20",
    Icon: XCircle,
  },
};

interface StatusBadgeProps {
  status: "scheduled" | "pending" | "cancelled";
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status];
  const { Icon } = config;

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 px-2 py-0.5 font-medium",
        config.className
      )}
    >
      <Icon className="size-3" />
      <span>{config.label}</span>
    </Badge>
  );
};
