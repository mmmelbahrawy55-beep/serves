"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Save, User, Bell, Shield, Database, Globe } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyAddress: "",
    currency: "EGP",
    language: "ar",
    timezone: "Africa/Cairo",
    taxRate: 0,
    lowStockAlert: true,
    emailNotifications: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      const data = await response.json();
      if (data.length > 0) {
        const settingsObj = data.reduce((acc: any, setting: any) => {
          acc[setting.key] = setting.value;
          return acc;
        }, {});
        setSettings({ ...settings, ...settingsObj });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const settingsArray = Object.entries(settings).map(([key, value]) => ({
        key,
        value: String(value),
      }));

      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: settingsArray }),
      });
      
      alert("تم حفظ الإعدادات بنجاح");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("حدث خطأ أثناء حفظ الإعدادات");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">جاري التحميل...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">الإعدادات</h1>
        <Button onClick={handleSave} variant="primary" disabled={saving}>
          <Save className="w-4 h-4 ml-2" />
          {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">معلومات الشركة</h2>
          </div>
          <div className="space-y-4">
            <Input
              label="اسم الشركة"
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
            />
            <Input
              label="البريد الإلكتروني للشركة"
              type="email"
              value={settings.companyEmail}
              onChange={(e) => setSettings({ ...settings, companyEmail: e.target.value })}
            />
            <Input
              label="رقم هاتف الشركة"
              value={settings.companyPhone}
              onChange={(e) => setSettings({ ...settings, companyPhone: e.target.value })}
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">عنوان الشركة</label>
              <textarea
                value={settings.companyAddress}
                onChange={(e) => setSettings({ ...settings, companyAddress: e.target.value })}
                className="flex w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-100 rounded-lg">
              <Database className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">الإعدادات المالية</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">العملة</label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="EGP">جنيه مصري (EGP)</option>
                <option value="USD">دولار أمريكي (USD)</option>
                <option value="EUR">يورو (EUR)</option>
                <option value="SAR">ريال سعودي (SAR)</option>
              </select>
            </div>
            <Input
              label="نسبة الضريبة (%)"
              type="number"
              value={settings.taxRate}
              onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Globe className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">الإعدادات العامة</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">اللغة</label>
              <select
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">التوقيت</label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Africa/Cairo">القاهرة (Africa/Cairo)</option>
                <option value="Asia/Riyadh">الرياض (Asia/Riyadh)</option>
                <option value="Asia/Dubai">دبي (Asia/Dubai)</option>
                <option value="Europe/London">لندن (Europe/London)</option>
                <option value="America/New_York">نيويورك (America/New_York)</option>
              </select>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Bell className="w-6 h-6 text-yellow-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">الإشعارات</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">تنبيه انخفاض المخزون</p>
                <p className="text-sm text-gray-500">إرسال إشعار عند انخفاض المخزون عن الحد الأدنى</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, lowStockAlert: !settings.lowStockAlert })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.lowStockAlert ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.lowStockAlert ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">الإشعارات البريدية</p>
                <p className="text-sm text-gray-500">إرسال إشعارات عبر البريد الإلكتروني</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.emailNotifications ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailNotifications ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-red-100 rounded-lg">
            <Shield className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">منطقة الخطر</h2>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h3 className="font-medium text-red-900 mb-2">حذف جميع البيانات</h3>
            <p className="text-sm text-red-700 mb-4">
              سيؤدي هذا الإجراء إلى حذف جميع البيانات من النظام بشكل دائم. لا يمكن التراجع عن هذا الإجراء.
            </p>
            <Button variant="destructive" size="sm">
              حذف جميع البيانات
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
