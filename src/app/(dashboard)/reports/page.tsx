"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Download, Calendar, TrendingUp, Users, DollarSign, Package } from "lucide-react";

export default function ReportsPage() {
  const [data, setData] = useState<any>({
    employees: [],
    sales: [],
    inventory: [],
    projects: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const [employeesRes, salesRes, inventoryRes, projectsRes] = await Promise.all([
        fetch("/api/employees"),
        fetch("/api/sales"),
        fetch("/api/inventory/products"),
        fetch("/api/projects"),
      ]);
      
      const employeesData = await employeesRes.json();
      const salesData = await salesRes.json();
      const inventoryData = await inventoryRes.json();
      const projectsData = await projectsRes.json();
      
      setData({
        employees: employeesData,
        sales: salesData,
        inventory: inventoryData,
        projects: projectsData,
      });
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const departmentData = data.employees.reduce((acc: any, emp: any) => {
    const dept = emp.department || "غير محدد";
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  const departmentChartData = Object.entries(departmentData).map(([name, value]) => ({ name, value }));

  const salesByMonth = data.sales.reduce((acc: any, sale: any) => {
    const month = new Date(sale.date).toLocaleString('ar-EG', { month: 'short' });
    acc[month] = (acc[month] || 0) + (sale.totalAmount || 0);
    return acc;
  }, {});

  const salesChartData = Object.entries(salesByMonth).map(([name, value]) => ({ name, value }));

  const projectStatusData = data.projects.reduce((acc: any, project: any) => {
    const status = project.status || "غير محدد";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const projectChartData = Object.entries(projectStatusData).map(([name, value]) => ({ 
    name: name === "PLANNING" ? "تخطيط" : name === "IN_PROGRESS" ? "قيد التنفيذ" : name === "COMPLETED" ? "مكتمل" : name === "ON_HOLD" ? "معلق" : "ملغي",
    value 
  }));

  const lowStockProducts = data.inventory.filter((p: any) => p.quantity <= p.minStock);

  if (loading) {
    return <div className="p-6">جاري التحميل...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">التقارير</h1>
        <Button variant="outline">
          <Download className="w-4 h-4 ml-2" />
          تصدير التقرير
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">إجمالي الموظفين</p>
              <p className="text-2xl font-bold text-gray-900">{data.employees.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">إجمالي المبيعات</p>
              <p className="text-2xl font-bold text-green-600">
                {data.sales.reduce((sum: number, s: any) => sum + (s.totalAmount || 0), 0).toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">إجمالي المنتجات</p>
              <p className="text-2xl font-bold text-purple-600">{data.inventory.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">إجمالي المشاريع</p>
              <p className="text-2xl font-bold text-yellow-600">{data.projects.length}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">الموظفين حسب القسم</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">المبيعات الشهرية</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">حالة المشاريع</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={projectChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {projectChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">منتجات منخفضة المخزون</h3>
          <div className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">لا توجد منتجات منخفضة المخزون</p>
            ) : (
              lowStockProducts.map((product: any) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">الكمية: {product.quantity} / الحد الأدنى: {product.minStock}</p>
                  </div>
                  <Badge variant="destructive">منخفض</Badge>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
