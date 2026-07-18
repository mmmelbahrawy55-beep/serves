"use client";

import { useEffect, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { arEG } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CalendarEvent = {
  date: string;
  type: "leave" | "attendance";
  status: string;
  title: string;
};

type Props = {
  onDateClick?: (date: Date) => void;
};

export function LeaveCalendar({ onDateClick }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth() + 1;

        const [leavesRes, attendanceRes] = await Promise.all([
          fetch("/api/leaves"),
          fetch(`/api/attendance?date=${year}-${String(month).padStart(2, "0")}-01`),
        ]);

        const leavesData = await leavesRes.json();
        const attendanceData = await attendanceRes.json();

        const evts: CalendarEvent[] = [];

        if (Array.isArray(leavesData)) {
          leavesData.forEach((leave: any) => {
            const start = new Date(leave.startDate);
            const end = new Date(leave.endDate);
            for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
              evts.push({
                date: format(d, "yyyy-MM-dd"),
                type: "leave",
                status: leave.status,
                title: `إجازة: ${leave.employee?.name || ""}`,
              });
            }
          });
        }

        if (Array.isArray(attendanceData)) {
          attendanceData.forEach((att: any) => {
            if (att.status === "PRESENT" || att.status === "LATE") {
              evts.push({
                date: att.date?.substring(0, 10) || format(new Date(att.date || currentMonth), "yyyy-MM-dd"),
                type: "attendance",
                status: att.status,
                title: `حضور: ${att.employeeName || ""}`,
              });
            }
          });
        }

        setEvents(evts);
      } catch {}
      setLoading(false);
    };

    fetchData();
  }, [currentMonth]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);

  const days: Date[] = [];
  let day = calStart;
  while (day <= calEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const getEventsForDay = (d: Date) => {
    const key = format(d, "yyyy-MM-dd");
    return events.filter((e) => e.date === key);
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "APPROVED": return "bg-green-100 text-green-700 border-green-200";
      case "PENDING": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "REJECTED": return "bg-red-100 text-red-700 border-red-200";
      case "PRESENT": return "bg-blue-100 text-blue-700 border-blue-200";
      case "LATE": return "bg-orange-100 text-orange-700 border-orange-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>التقويم</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <span className="text-sm font-semibold min-w-[120px] text-center">
              {format(currentMonth, "MMMM yyyy", { locale: arEG })}
            </span>
            <Button variant="outline" size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-3 text-xs text-gray-500 mt-2">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500" /> إجازة معتمدة
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-500" /> معلقة
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> حضور
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
              {["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"].map((d) => (
                <div key={d} className="bg-gray-50 p-2 text-center text-xs font-semibold text-gray-500">
                  {d}
                </div>
              ))}
              {days.map((d, i) => {
                const dayEvents = getEventsForDay(d);
                return (
                  <div
                    key={i}
                    className={`bg-white p-1.5 min-h-[80px] cursor-pointer hover:bg-gray-50 transition-colors ${
                      !isSameMonth(d, currentMonth) ? "opacity-40" : ""
                    } ${isSameDay(d, new Date()) ? "ring-2 ring-blue-400 ring-inset" : ""}`}
                    onClick={() => onDateClick?.(d)}
                  >
                    <span className="text-xs font-medium text-gray-600">
                      {format(d, "d")}
                    </span>
                    <div className="mt-1 space-y-0.5">
                      {dayEvents.slice(0, 3).map((evt, j) => (
                        <div
                          key={j}
                          className={`text-[9px] px-1 py-0.5 rounded border ${statusColor(evt.status)} truncate leading-tight`}
                          title={evt.title}
                        >
                          {evt.title.length > 12 ? evt.title.substring(0, 12) + ".." : evt.title}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <span className="text-[9px] text-gray-400">+{dayEvents.length - 3}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
