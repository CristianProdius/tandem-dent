"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  type DayAvailability,
  getDoctorAvailability,
} from "@/lib/actions/appointment.actions";
import { cn } from "@/lib/utils";

// Day names
const DAY_NAMES_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Helper functions
const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
  return new Date(d.setDate(diff));
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return formatDate(date1) === formatDate(date2);
};

const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

// Format time from hours and minutes
const formatTime = (hour: number, minute: number): string => {
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
};

interface AvailabilityCalendarProps {
  doctorId: string;
  selectedDate: Date | null;
  onSelectSlot: (date: Date) => void;
  requiredDuration?: number; // minutes needed for appointment
}

export function AvailabilityCalendar({
  doctorId,
  selectedDate,
  onSelectSlot,
  requiredDuration = 30,
}: AvailabilityCalendarProps) {
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [availability, setAvailability] = useState<DayAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate week end
  const weekEnd = useMemo(() => {
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 6);
    return end;
  }, [weekStart]);

  // Fetch availability when doctor or week changes
  const fetchAvailability = useCallback(async () => {
    if (!doctorId) return;

    setIsLoading(true);
    try {
      const startDate = formatDate(weekStart);
      const endDate = formatDate(weekEnd);

      const data = await getDoctorAvailability(
        doctorId,
        startDate,
        endDate,
        requiredDuration
      );
      setAvailability(data);
    } catch (error) {
      console.error("Error fetching availability:", error);
    } finally {
      setIsLoading(false);
    }
  }, [doctorId, weekStart, weekEnd, requiredDuration]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  // Navigation handlers
  const goToToday = () => setWeekStart(getWeekStart(new Date()));

  const goToPrevious = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
  };

  const goToNext = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
  };

  // Get header title
  const getHeaderTitle = (): string => {
    if (weekStart.getMonth() === weekEnd.getMonth()) {
      return `${weekStart.getDate()} - ${weekEnd.getDate()} ${MONTH_NAMES[weekStart.getMonth()]}`;
    } else {
      return `${weekStart.getDate()} ${MONTH_NAMES[weekStart.getMonth()].slice(0, 3)} - ${weekEnd.getDate()} ${MONTH_NAMES[weekEnd.getMonth()].slice(0, 3)}`;
    }
  };

  // Generate time blocks based on duration
  const timeBlocks = useMemo(() => {
    const blocks: { hour: number; minute: number; label: string }[] = [];
    const startHour = 8;
    const endHour = 20;
    const totalMinutes = (endHour - startHour) * 60;

    let currentMinutes = 0;
    while (currentMinutes + requiredDuration <= totalMinutes) {
      const hour = startHour + Math.floor(currentMinutes / 60);
      const minute = currentMinutes % 60;
      const endMinutes = currentMinutes + requiredDuration;
      const endHourCalc = startHour + Math.floor(endMinutes / 60);
      const endMinuteCalc = endMinutes % 60;

      blocks.push({
        hour,
        minute,
        label: `${formatTime(hour, minute)} - ${formatTime(endHourCalc, endMinuteCalc)}`,
      });

      currentMinutes += requiredDuration;
    }

    return blocks;
  }, [requiredDuration]);

  // Check if a time block is available for a specific day
  const isBlockAvailable = (dayIndex: number, hour: number, minute: number): { available: boolean; occupiedBy?: { patientName?: string; reason?: string } } => {
    const day = availability[dayIndex];
    if (!day || day.isClosed) return { available: false };

    const slotsNeeded = Math.ceil(requiredDuration / 30);
    let blockStartTime = hour * 60 + minute;

    for (let i = 0; i < slotsNeeded; i++) {
      const slotHour = Math.floor(blockStartTime / 60);
      const slotMinute = blockStartTime % 60;

      const slot = day.slots.find((s) => {
        const slotDate = new Date(s.start);
        return slotDate.getHours() === slotHour && slotDate.getMinutes() === slotMinute;
      });

      if (!slot || !slot.available) {
        return {
          available: false,
          occupiedBy: slot ? { patientName: slot.patientName, reason: slot.reason } : undefined
        };
      }

      blockStartTime += 30;
    }

    return { available: true };
  };

  // Check if block is selected
  const isBlockSelected = (dayIndex: number, hour: number, minute: number): boolean => {
    if (!selectedDate) return false;

    const day = availability[dayIndex];
    if (!day) return false;

    const blockDate = new Date(day.date);
    blockDate.setHours(hour, minute, 0, 0);

    return blockDate.getTime() === selectedDate.getTime();
  };

  // Handle block click
  const handleBlockClick = (dayIndex: number, hour: number, minute: number) => {
    const day = availability[dayIndex];
    if (!day) return;

    const blockDate = new Date(day.date);
    blockDate.setHours(hour, minute, 0, 0);

    onSelectSlot(blockDate);
  };

  if (!doctorId) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">
            Select a doctor to see availability
          </p>
        </CardContent>
      </Card>
    );
  }

  const blockHeight = Math.max(32, Math.round((requiredDuration / 30) * 32));

  return (
    <div className="flex flex-col space-y-3">
      {/* Header with navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={goToToday}
          >
            Today
          </Button>
          <div className="flex items-center">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={goToPrevious}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={goToNext}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="text-right">
          <h3 className="text-sm font-semibold">
            {getHeaderTitle()}
          </h3>
          <p className="text-xs text-muted-foreground">
            {requiredDuration} min blocks
          </p>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            <TooltipProvider delayDuration={200}>
              <div className="min-w-[700px] overflow-x-auto">
                {/* Day Headers */}
                <div className="grid grid-cols-8 border-b bg-muted/50">
                  <div className="p-2 text-xs font-medium text-muted-foreground text-center">
                    Time
                  </div>
                  {availability.map((day, idx) => {
                    const dayDate = new Date(day.date);
                    const today = isToday(dayDate);
                    const isSunday = day.isClosed;

                    return (
                      <div
                        key={idx}
                        className={cn(
                          "p-2 text-center border-l",
                          today && "bg-primary/10",
                          isSunday && "bg-muted"
                        )}
                      >
                        <div className={cn(
                          "text-xs font-medium",
                          today ? "text-primary" : isSunday ? "text-muted-foreground" : "text-muted-foreground"
                        )}>
                          {DAY_NAMES_SHORT[day.dayOfWeek]}
                        </div>
                        <div className={cn(
                          "text-lg font-semibold",
                          today ? "text-primary" : isSunday ? "text-muted-foreground" : "text-foreground"
                        )}>
                          {dayDate.getDate()}
                        </div>
                        {isSunday && (
                          <div className="text-[10px] text-muted-foreground">Closed</div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Time Blocks */}
                <div className="max-h-[400px] overflow-y-auto">
                  {timeBlocks.map((block, blockIdx) => (
                    <div
                      key={blockIdx}
                      className="grid grid-cols-8 border-b"
                    >
                      {/* Time Label */}
                      <div
                        className="p-1.5 text-[10px] text-muted-foreground text-center bg-muted/30 flex items-center justify-center"
                        style={{ height: `${blockHeight}px` }}
                      >
                        <span className="leading-tight">
                          {block.label.split(" - ").map((t, i) => (
                            <span key={i}>
                              {t}
                              {i === 0 && <br />}
                            </span>
                          ))}
                        </span>
                      </div>

                      {/* Day Columns */}
                      {availability.map((day, dayIdx) => {
                        const blockStatus = isBlockAvailable(dayIdx, block.hour, block.minute);
                        const isSelected = isBlockSelected(dayIdx, block.hour, block.minute);
                        const dayDate = new Date(day.date);
                        const today = isToday(dayDate);

                        return (
                          <div
                            key={dayIdx}
                            className={cn(
                              "border-l p-0.5",
                              today && "bg-primary/5"
                            )}
                            style={{ height: `${blockHeight}px` }}
                          >
                            {day.isClosed ? (
                              <div className="h-full rounded bg-muted flex items-center justify-center">
                                <span className="text-[10px] text-muted-foreground">-</span>
                              </div>
                            ) : blockStatus.available ? (
                              <button
                                type="button"
                                onClick={() => handleBlockClick(dayIdx, block.hour, block.minute)}
                                className={cn(
                                  "w-full h-full rounded text-xs font-medium transition-all flex items-center justify-center",
                                  isSelected
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : "bg-background hover:bg-primary/10 hover:border-primary border text-muted-foreground hover:text-primary"
                                )}
                              >
                                {isSelected && "✓"}
                              </button>
                            ) : (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="w-full h-full rounded bg-muted/80 flex items-center justify-center cursor-not-allowed">
                                    <span className="text-[10px] text-muted-foreground truncate px-1">
                                      {blockStatus.occupiedBy?.patientName?.split(" ")[0] || "Busy"}
                                    </span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-sm">
                                    <span className="font-medium">Busy:</span> {blockStatus.occupiedBy?.patientName || "Appointment"}
                                  </p>
                                  {blockStatus.occupiedBy?.reason && (
                                    <p className="text-xs text-muted-foreground">{blockStatus.occupiedBy.reason}</p>
                                  )}
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </TooltipProvider>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded border bg-background" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded bg-muted" />
          <span>Busy</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded bg-primary" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded bg-muted" />
          <span>Closed</span>
        </div>
      </div>

      {/* Selected time display */}
      {selectedDate && (
        <div className="rounded-lg bg-primary/10 border border-primary/20 p-3">
          <p className="text-sm text-primary">
            <span className="font-medium">Selected appointment:</span>{" "}
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            from{" "}
            {selectedDate.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {" to "}
            {new Date(selectedDate.getTime() + requiredDuration * 60 * 1000).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {" "}
            <span className="opacity-75">({requiredDuration} min)</span>
          </p>
        </div>
      )}
    </div>
  );
}
