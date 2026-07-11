"use client";

import {
  BarChart3,
  Users,
  Package,
  DollarSign,
  Download,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const monthlySales = [
  { month: "يناير", value: 45000 },
  { month: "فبراير", value: 52000 },
  { month: "مارس", value: 38000 },
  { month: "أبريل", value: 61000 },
  { month: "مايو", value: 48000 },
  { month: "يونيو", value: 72000 },
];

const departmentEmployees = [
  { name: "تقنية", value: 25 },
  { name: "مبيعات", value: 18 },
  { name: "موارد", value: 10 },
  { name: "مالية", value: 8 },
  { name: "تسويق", value: 12 },
];

const inventoryCategories = [
  { name: "إلكترونيات", value: 35 },
  { name: "ملابس", value: 25 },
  { name: "مواد", value: 20 },
  { name: "أخرى", value: 15 },
];

const financialData = [
  { month: "يناير", إيرادات: 65000, مصروفات: 42000 },
  { month: "فبراير", إيرادات: 72000, مصروفات: 45000 },
  { month: "مارس", إيرادات: 58000, مصروفات: 38000 },
  { month: "أبريل", إيرادات: 81000, مصروفات: 51000 },
  { month: "مايو", إيرادات: 68000, مصروفات: 43000 },
  { month: "يونيو", إيرادات: 92000, مصروفات: 55000 },
];

const PIE_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

const reportCards = [
  {
    title: "تقارير المبيعات",
    description: "تحليل المبيعات والإيرادات الشهرية",
    icon: BarChart3,
    color: "bg-blue-500",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    type: "sales",
  },
  {
    title: "تقارير الموظفين",
    description: "إحصائيات الموظفين والأقسام",
    icon: Users,
    color: "bg-emerald-500",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-600",
    type: "employees",
  },
  {
    title: "تقارير المخازن",
    description: "حالة المخزون وتصنيف المنتجات",
    icon: Package,
    color: "bg-amber-500",
    bgColor: "bg-amber-50",
    textColor: "text-amber-600",
    type: "inventory",
  },
  {
    title: "التقارير المالية",
    description: "الإيرادات والمصروفات والأرباح",
    icon: DollarSign,
    color: "bg-purple-500",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
    type: "financial",
  },
];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async (type: string) => {
    setSelectedReport(type);
    setGenerating(true);
    try {
      const res = await fetch(`/api/reports/${type}`);
      if (!res.ok) throw new Error();
      toast.success("تم إنشاء التقرير بنجاح");
    } catch {
      toast.error("فشل إنشاء التقرير");
    } finally {
      setGenerating(false);
    }
  };

  const renderChart = () => {
    switch (selectedReport) {
      case "sales":
        return (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case "employees":
        return (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentEmployees}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {departmentEmployees.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      case "inventory":
        return (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={inventoryCategories}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {inventoryCategories.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      case "financial":
        return (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="إيرادات"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: "#3B82F6" }}
                />
                <Line
                  type="monotone"
                  dataKey="مصروفات"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={{ fill: "#EF4444" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">التقارير</h1>
        <p className="text-gray-500 mt-1">إنشاء وعرض التقارير والتحليلات</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportCards.map((card) => (
          <Card key={card.type} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center`}
                >
                  <card.icon className={`h-6 w-6 ${card.textColor}`} />
                </div>
                <div>
                  <CardTitle className="text-base">{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </div>
              </div>
              <Button
                variant="primary"
                className="w-full"
                onClick={() => handleGenerate(card.type)}
                disabled={generating && selectedReport === card.type}
              >
                {generating && selectedReport === card.type ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                إنشاء تقرير
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedReport && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>
              {
                reportCards.find((c) => c.type === selectedReport)
                  ?.title
              }
            </CardTitle>
            <CardDescription>عرض بياني للتقرير</CardDescription>
          </CardHeader>
          <CardContent>{renderChart()}</CardContent>
        </Card>
      )}

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>المبيعات الشهرية</CardTitle>
          <CardDescription>عرض المبيعات خلال الأشهر الستة الماضية</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
