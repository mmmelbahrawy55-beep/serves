"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, CalendarDays, Building2, UserCircle, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

type LeaveDetail = {
  id: string;
  startDate: string;
  endDate: string;
  type: string;
  reason: string | null;
  status: string;
  approvedBy: string | null;
  createdAt: string;
  employee: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    department: string | null;
    position: string | null;
    avatar: string | null;
    status: string;
  };
};

const leaveTypeLabels: Record<string, string> = {
  SICK: "مرضي", ANNUAL: "سنوي", EMERGENCY: "طارئ", PERSONAL: "شخصي",
};

const statusConfig: Record<string, { variant: "success" | "danger" | "warning" | "primary"; label: string; icon: any }> = {
  PENDING: { variant: "warning", label: "قيد الانتظار", icon: AlertCircle },
  APPROVED: { variant: "success", label: "معتمدة", icon: CheckCircle2 },
  REJECTED: { variant: "danger", label: "مرفوضة", icon: XCircle },
};

export default function LeaveDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [leave, setLeave] = useState<LeaveDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/leaves/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { toast.error(data.error); return; }
        setLeave(data);
      })
      .catch(() => toast.error("فشل تحميل بيانات الإجازة"))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!leave) {
    return (
      <div className="text-center py-20 text-gray-500">
        لم يتم العثور على الإجازة
      </div>
    );
  }

  const days = Math.ceil(
    (new Date(leave.endDate).getTime() - new Date(leave.startDate).getTime()) /
      (1000 * 60 * 60 * 24)
  ) + 1;

  const StatusIcon = statusConfig[leave.status]?.icon || AlertCircle;
  const statusVariant = statusConfig[leave.status]?.variant || "default";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">تفاصيل الإجازة</h1>
          <p className="text-gray-500 mt-1">عرض معلومات طلب الإجازة</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>معلومات الإجازة</CardTitle>
              <Badge variant={statusVariant as any}>
                <StatusIcon className="h-3 w-3 ml-1 inline" />
                {statusConfig[leave.status]?.label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-6">
              <div>
                <dt className="text-sm text-gray-500">النوع</dt>
                <dd className="font-medium mt-1">{leaveTypeLabels[leave.type] || leave.type}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">عدد الأيام</dt>
                <dd className="font-medium mt-1">{days} أيام</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">تاريخ البداية</dt>
                <dd className="font-medium mt-1">{formatDate(leave.startDate)}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">تاريخ النهاية</dt>
                <dd className="font-medium mt-1">{formatDate(leave.endDate)}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-sm text-gray-500">السبب</dt>
                <dd className="font-medium mt-1">{leave.reason || "—"}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">تاريخ الطلب</dt>
                <dd className="font-medium mt-1">{formatDate(leave.createdAt)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>الموظف</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                {leave.employee.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold">{leave.employee.name}</p>
                <p className="text-sm text-gray-500">{leave.employee.email}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm border-t pt-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Building2 className="h-4 w-4" />
                <span>{leave.employee.department || "—"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <UserCircle className="h-4 w-4" />
                <span>{leave.employee.position || "—"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
