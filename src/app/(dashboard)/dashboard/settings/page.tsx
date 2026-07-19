"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Building2, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";

type CompanyInfo = {
  name: string;
  address: string;
  phone: string;
  email: string;
  taxNumber: string;
};

type SystemPrefs = {
  language: string;
  currency: string;
  fiscalYearStart: string;
  fiscalYearEnd: string;
};

export default function SettingsPage() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "",
    address: "",
    phone: "",
    email: "",
    taxNumber: "",
  });
  const [systemPrefs, setSystemPrefs] = useState<SystemPrefs>({
    language: "ar",
    currency: "EGP",
    fiscalYearStart: "2024-01-01",
    fiscalYearEnd: "2024-12-31",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.companyInfo) setCompanyInfo(data.companyInfo);
        if (data.systemPrefs) setSystemPrefs(data.systemPrefs);
      } catch {
        // Use defaults
      } finally {
        setIsLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyInfo, systemPrefs }),
      });
      if (!res.ok) throw new Error();
      toast.success("تم حفظ الإعدادات بنجاح");
    } catch {
      toast.error("فشل حفظ الإعدادات");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">الإعدادات</h1>
        <p className="text-gray-500 mt-1">إعدادات النظام والشركة</p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle>معلومات الشركة</CardTitle>
              <CardDescription>
                البيانات الأساسية للشركة
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="اسم الشركة"
              value={companyInfo.name}
              onChange={(e) =>
                setCompanyInfo({ ...companyInfo, name: e.target.value })
              }
            />
            <Input
              label="رقم الهاتف"
              value={companyInfo.phone}
              onChange={(e) =>
                setCompanyInfo({ ...companyInfo, phone: e.target.value })
              }
            />
          </div>
          <Input
            label="البريد الإلكتروني"
            type="email"
            value={companyInfo.email}
            onChange={(e) =>
              setCompanyInfo({ ...companyInfo, email: e.target.value })
            }
          />
          <Input
            label="العنوان"
            value={companyInfo.address}
            onChange={(e) =>
              setCompanyInfo({ ...companyInfo, address: e.target.value })
            }
          />
          <Input
            label="الرقم الضريبي"
            value={companyInfo.taxNumber}
            onChange={(e) =>
              setCompanyInfo({
                ...companyInfo,
                taxNumber: e.target.value,
              })
            }
          />
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Settings2 className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <CardTitle>إعدادات النظام</CardTitle>
              <CardDescription>
                تفضيلات النظام والعملة
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="اللغة"
              value={systemPrefs.language}
              onChange={(e) =>
                setSystemPrefs({
                  ...systemPrefs,
                  language: e.target.value,
                })
              }
              options={[
                { value: "ar", label: "العربية" },
                { value: "en", label: "English" },
              ]}
            />
            <Select
              label="العملة"
              value={systemPrefs.currency}
              onChange={(e) =>
                setSystemPrefs({
                  ...systemPrefs,
                  currency: e.target.value,
                })
              }
              options={[
                { value: "EGP", label: "جنيه مصري (EGP)" },
                { value: "USD", label: "دولار أمريكي (USD)" },
                { value: "SAR", label: "ريال سعودي (SAR)" },
                { value: "AED", label: "درهم إماراتي (AED)" },
              ]}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="بداية السنة المالية"
              type="date"
              value={systemPrefs.fiscalYearStart}
              onChange={(e) =>
                setSystemPrefs({
                  ...systemPrefs,
                  fiscalYearStart: e.target.value,
                })
              }
            />
            <Input
              label="نهاية السنة المالية"
              type="date"
              value={systemPrefs.fiscalYearEnd}
              onChange={(e) =>
                setSystemPrefs({
                  ...systemPrefs,
                  fiscalYearEnd: e.target.value,
                })
              }
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="primary"
            size="lg"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            حفظ الإعدادات
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
