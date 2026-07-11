"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Clock, Calendar, LogIn, LogOut } from "lucide-react";

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      const [attendanceRes, employeesRes] = await Promise.all([
        fetch(`/api/attendance?date=${selectedDate}`),
        fetch("/api/employees"),
      ]);
      
      const attendanceData = await attendanceRes.json();
      const employeesData = await employeesRes.json();
      
      setAttendance(attendanceData);
      setEmployees(employeesData);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClockIn = async (employeeId: string) => {
    try {
      await fetch("/api/attendance/clock-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, date: selectedDate }),
      });
      fetchData();
    } catch (error) {
      console.error("Error clocking in:", error);
    }
  };

  const handleClockOut = async (employeeId: string) => {
    try {
      await fetch("/api/attendance/clock-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, date: selectedDate }),
      });
      fetchData();
    } catch (error) {
      console.error("Error clocking out:", error);
    }
  };

  if (loading) {
    return <div className="p-6">جاري التحميل...</div>;
  }

  const presentCount = attendance.filter(a => a.status === "PRESENT").length;
  const absentCount = attendance.filter(a => a.status === "ABSENT").length;
  const lateCount = attendance.filter(a => a.status === "LATE").length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">الحضور والانصراف</h1>
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="flex h-10 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">الحاضرين</p>
              <p className="text-2xl font-bold text-green-600">{presentCount}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">الغائبين</p>
              <p className="text-2xl font-bold text-red-600">{absentCount}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Calendar className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">المتأخرين</p>
              <p className="text-2xl font-bold text-yellow-600">{lateCount}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <LogOut className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">سجل الحضور</h2>
        <Table
          columns={[
            { header: "الموظف", accessor: "employee", render: (emp: any) => emp?.name || "-" },
            { header: "التاريخ", accessor: "date", render: (date: string) => new Date(date).toLocaleDateString('ar-EG') },
            { header: "وقت الحضور", accessor: "checkIn", render: (time: string) => time ? new Date(time).toLocaleTimeString('ar-EG') : "-" },
            { header: "وقت الانصراف", accessor: "checkOut", render: (time: string) => time ? new Date(time).toLocaleTimeString('ar-EG') : "-" },
            { 
              header: "الحالة", 
              accessor: "status",
              render: (value: string) => {
                const variants: Record<string, any> = {
                  PRESENT: "default",
                  ABSENT: "destructive",
                  LATE: "secondary",
                };
                const labels: Record<string, string> = {
                  PRESENT: "حاضر",
                  ABSENT: "غائب",
                  LATE: "متأخر",
                };
                return <Badge variant={variants[value] || "default"}>{labels[value] || value}</Badge>;
              }
            },
            { header: "ملاحظات", accessor: "notes" },
            {
              header: "الإجراءات",
              render: (row: any) => (
                <div className="flex gap-2">
                  {!row.checkIn && (
                    <Button size="sm" variant="ghost" onClick={() => handleClockIn(row.employeeId)}>
                      <LogIn className="w-4 h-4" />
                    </Button>
                  )}
                  {row.checkIn && !row.checkOut && (
                    <Button size="sm" variant="ghost" onClick={() => handleClockOut(row.employeeId)}>
                      <LogOut className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ),
            },
          ]}
          data={attendance}
        />
      </div>
    </div>
  );
}
