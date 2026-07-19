"use client";

import {
  BarChart3,
  Users,
  Package,
  DollarSign,
  Download,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { generateReportPDF } from "@/lib/generate-pdf";
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
      color: "bg-violet-500",
      bgColor: "bg-violet-50",
      textColor: "text-violet-600",
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

  const handleGenerate = async (type: string) => {
    setSelectedReport(type);
  };

  const handleDownloadPDF = (type: string) => {
    const titles: Record<string, string> = {
      sales: "تقرير المبيعات",
      employees: "تقرير الموظفين",
      inventory: "تقرير المخازن",
      financial: "التقرير المالي",
    };
    try {
      generateReportPDF(type, titles[type] || type);
      toast.success("تم تحميل التقرير");
    } catch {
      toast.error("حدث خطأ أثناء إنشاء التقرير");
    }
  };

  const SimpleBarChart = ({ data }: { data: typeof monthlySales }) => {
    const max = Math.max(...data.map(d => d.value));
    return (
      <div className="h-80 flex items-end gap-2" dir="ltr">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-xs text-gray-500">{Math.round(d.value / 1000)}k</span>
            <div
              className="w-full rounded-t-md transition-all duration-500"
              style={{
                height: `${(d.value / max) * 100}%`,
                backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                minHeight: 4,
              }}
            />
            <span className="text-xs text-gray-500">{d.month}</span>
          </div>
        ))}
      </div>
    );
  };

  const SimplePieChart = ({ data }: { data: typeof departmentEmployees }) => {
    const total = data.reduce((s, d) => s + d.value, 0);
    return (
      <div className="flex flex-wrap gap-4 justify-center p-4">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
            <span>{d.name}</span>
            <span className="text-gray-500">{Math.round((d.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    );
  };

  const SimpleLineChart = ({ data }: { data: typeof financialData }) => {
    const allValues = data.flatMap(d => [d.إيرادات, d.مصروفات]);
    const max = Math.max(...allValues);
    return (
      <div className="h-80 relative" dir="ltr">
        <svg viewBox={`0 0 ${data.length * 80} 280`} className="w-full h-full">
          {data.map((d, i) => {
            const x = i * 80 + 40;
            const revY = 240 - (d.إيرادات / max) * 220;
            const expY = 240 - (d.مصروفات / max) * 220;
            return (
              <g key={i}>
                {i > 0 && (
                  <>
                    <line x1={(i-1)*80+40} y1={240 - (data[i-1].إيرادات / max) * 220} x2={x} y2={revY} stroke="#3B82F6" strokeWidth="2" />
                    <line x1={(i-1)*80+40} y1={240 - (data[i-1].مصروفات / max) * 220} x2={x} y2={expY} stroke="#EF4444" strokeWidth="2" />
                  </>
                )}
                <circle cx={x} cy={revY} r="4" fill="#3B82F6" />
                <circle cx={x} cy={expY} r="4" fill="#EF4444" />
                <text x={x} y="270" textAnchor="middle" fontSize="11" fill="#9CA3AF">{d.month.substring(0, 4)}</text>
              </g>
            );
          })}
        </svg>
        <div className="absolute top-2 left-2 flex gap-4 text-xs">
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-500 inline-block" /> إيرادات</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-red-500 inline-block" /> مصروفات</span>
        </div>
      </div>
    );
  };

  const renderChart = () => {
    switch (selectedReport) {
      case "sales":
        return <SimpleBarChart data={monthlySales} />;
      case "employees":
        return <SimplePieChart data={departmentEmployees} />;
      case "inventory":
        return <SimplePieChart data={inventoryCategories} />;
      case "financial":
        return <SimpleLineChart data={financialData} />;
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
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => handleGenerate(card.type)}
                >
                  <Download className="h-4 w-4" />
                  عرض
                </Button>
                <Button
                  variant="outline"
                  className="flex-shrink-0"
                  onClick={() => handleDownloadPDF(card.type)}
                  title="تحميل PDF"
                >
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
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
          <SimpleBarChart data={monthlySales} />
        </CardContent>
      </Card>
    </div>
  );
}
