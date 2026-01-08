"use client";

import * as React from "react";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";

// Sample data - in production, this would come from the server
const chartData = [
  { date: "2024-12-01", scheduled: 8, pending: 2, cancelled: 1 },
  { date: "2024-12-02", scheduled: 12, pending: 3, cancelled: 0 },
  { date: "2024-12-03", scheduled: 10, pending: 1, cancelled: 2 },
  { date: "2024-12-04", scheduled: 15, pending: 4, cancelled: 1 },
  { date: "2024-12-05", scheduled: 9, pending: 2, cancelled: 0 },
  { date: "2024-12-06", scheduled: 14, pending: 3, cancelled: 1 },
  { date: "2024-12-07", scheduled: 6, pending: 1, cancelled: 0 },
  { date: "2024-12-08", scheduled: 11, pending: 2, cancelled: 1 },
  { date: "2024-12-09", scheduled: 13, pending: 4, cancelled: 0 },
  { date: "2024-12-10", scheduled: 10, pending: 2, cancelled: 2 },
  { date: "2024-12-11", scheduled: 16, pending: 3, cancelled: 1 },
  { date: "2024-12-12", scheduled: 12, pending: 1, cancelled: 0 },
  { date: "2024-12-13", scheduled: 8, pending: 2, cancelled: 1 },
  { date: "2024-12-14", scheduled: 5, pending: 1, cancelled: 0 },
  { date: "2024-12-15", scheduled: 14, pending: 3, cancelled: 2 },
  { date: "2024-12-16", scheduled: 11, pending: 2, cancelled: 0 },
  { date: "2024-12-17", scheduled: 9, pending: 4, cancelled: 1 },
  { date: "2024-12-18", scheduled: 13, pending: 2, cancelled: 1 },
  { date: "2024-12-19", scheduled: 15, pending: 3, cancelled: 0 },
  { date: "2024-12-20", scheduled: 10, pending: 1, cancelled: 2 },
  { date: "2024-12-21", scheduled: 7, pending: 2, cancelled: 0 },
  { date: "2024-12-22", scheduled: 12, pending: 3, cancelled: 1 },
  { date: "2024-12-23", scheduled: 14, pending: 2, cancelled: 0 },
  { date: "2024-12-24", scheduled: 8, pending: 1, cancelled: 1 },
  { date: "2024-12-25", scheduled: 4, pending: 0, cancelled: 0 },
  { date: "2024-12-26", scheduled: 11, pending: 2, cancelled: 1 },
  { date: "2024-12-27", scheduled: 13, pending: 3, cancelled: 0 },
  { date: "2024-12-28", scheduled: 9, pending: 1, cancelled: 2 },
  { date: "2024-12-29", scheduled: 6, pending: 2, cancelled: 0 },
  { date: "2024-12-30", scheduled: 15, pending: 4, cancelled: 1 },
];

const chartConfig = {
  appointments: {
    label: "Programări",
  },
  scheduled: {
    label: "Programat",
    color: "var(--chart-1)",
  },
  pending: {
    label: "În așteptare",
    color: "var(--chart-2)",
  },
  cancelled: {
    label: "Anulat",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export function AppointmentsChart() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("30d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-12-30");
    let daysToSubtract = 30;
    if (timeRange === "7d") {
      daysToSubtract = 7;
    } else if (timeRange === "14d") {
      daysToSubtract = 14;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Tendințe programări</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            Rezumat zilnic programări pentru ultima lună
          </span>
          <span className="@[540px]/card:hidden">Luna trecută</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="@[767px]/card:flex hidden *:data-[slot=toggle-group-item]:px-4!"
          >
            <ToggleGroupItem value="30d">Ultimele 30 de zile</ToggleGroupItem>
            <ToggleGroupItem value="14d">Ultimele 14 zile</ToggleGroupItem>
            <ToggleGroupItem value="7d">Ultimele 7 zile</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex @[767px]/card:hidden w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
              size="sm"
              aria-label="Selectează o valoare"
            >
              <SelectValue placeholder="Ultimele 30 de zile" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="30d" className="rounded-lg">
                Ultimele 30 de zile
              </SelectItem>
              <SelectItem value="14d" className="rounded-lg">
                Ultimele 14 zile
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Ultimele 7 zile
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-62 w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillScheduled" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-scheduled)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-scheduled)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillPending" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-pending)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-pending)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("ro-RO", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("ro-RO", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="scheduled"
              type="natural"
              fill="url(#fillScheduled)"
              stroke="var(--color-scheduled)"
              stackId="a"
            />
            <Area
              dataKey="pending"
              type="natural"
              fill="url(#fillPending)"
              stroke="var(--color-pending)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
