"use client";

import { useState, useEffect } from "react";
import { Loader2, Clock, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LeaveCalendar } from "@/components/calendar/leave-calendar";
import { formatDateTime } from "@/lib/utils";
import { toast } from "sonner";

type Attendance = {
  id: string;
  employeeId: string;
  employeeName: string;
  checkIn: string;
  checkOut: string | null;
  status: string;
  notes: string | null;
};

export default function AttendancePage() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [checkingIn, setCheckingIn] = useState<string | null>(null);

  const fetchAttendance = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/attendance?date=${date}`);
      const data = await res.json();
      setAttendances(Array.isArray(data) ? data : []);
    } catch {
      toast.error("فشل تحميل بيانات الحضور");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [date]);

  const handleCheckIn = async (employeeId: string) => {
    setCheckingIn(employeeId);
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId }),
      });
      if (!res.ok) throw new Error();
      toast.success("تم تسجيل الحضور");
      fetchAttendance();
    } catch {
      toast.error("فشل تسجيل الحضور");
    } finally {
      setCheckingIn(null);
    }
  };

  const handleCheckOut = async (id: string) => {
    try {
      const res = await fetch(`/api/attendance/${id}/check-out`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error();
      toast.success("تم تسجيل الانصراف");
      fetchAttendance();
    } catch {
      toast.error("فشل تسجيل الانصراف");
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, { variant: "success" | "danger" | "warning" | "primary"; label: string }> = {
      PRESENT: { variant: "success", label: "حاضر" },
      ABSENT: { variant: "danger", label: "غائب" },
      LATE: { variant: "warning", label: "متأخر" },
      LEAVE: { variant: "primary", label: "إجازة" },
    };
    const item = map[status] || { variant: "default" as const, label: status };
    return <Badge variant={item.variant}>{item.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الحضور والانصراف</h1>
          <p className="text-gray-500 mt-1">تسجيل ومتابعة حضور الموظفين</p>
        </div>
        <div className="flex items-center gap-3">
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-44"
          />
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>سجل الحضور</CardTitle>
          <CardDescription>
            عرض وتحديث سجل الحضور ليوم{" "}
            {new Date(date).toLocaleDateString("ar-EG")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : attendances.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">لا توجد سجلات حضور لهذا اليوم</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الموظف</TableHead>
                  <TableHead>وقت الحضور</TableHead>
                  <TableHead>وقت الانصراف</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>ملاحظات</TableHead>
                  <TableHead className="text-center">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendances.map((att) => (
                  <TableRow key={att.id}>
                    <TableCell className="font-medium">
                      {att.employeeName}
                    </TableCell>
                    <TableCell>
                      {att.checkIn
                        ? formatDateTime(att.checkIn)
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {att.checkOut
                        ? formatDateTime(att.checkOut)
                        : "—"}
                    </TableCell>
                    <TableCell>{statusBadge(att.status)}</TableCell>
                    <TableCell>{att.notes || "—"}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        {!att.checkIn && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleCheckIn(att.employeeId)}
                            disabled={checkingIn === att.employeeId}
                          >
                            {checkingIn === att.employeeId ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : null}
                            تسجيل حضـور
                          </Button>
                        )}
                        {att.checkIn && !att.checkOut && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCheckOut(att.id)}
                          >
                            تسجيل انصراف
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <LeaveCalendar onDateClick={(date) => setDate(date.toISOString().split("T")[0])} />
    </div>
  );
}
