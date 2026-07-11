"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export default function AccountingPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [accountsRes, entriesRes] = await Promise.all([
        fetch("/api/accounting/accounts"),
        fetch("/api/accounting/journal-entries"),
      ]);

      const accountsData = await accountsRes.json();
      const entriesData = await entriesRes.json();

      setAccounts(accountsData);
      setJournalEntries(entriesData);
    } catch (error) {
      console.error("Error fetching accounting data:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalDebits = journalEntries.reduce((sum: number, entry: any) =>
    sum + entry.lines.reduce((acc: number, line: any) => acc + (line.debit || 0), 0), 0
  );

  const totalCredits = journalEntries.reduce((sum: number, entry: any) =>
    sum + entry.lines.reduce((acc: number, line: any) => acc + (line.credit || 0), 0), 0
  );

  if (loading) {
    return <div className="p-6">جاري التحميل...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">المحاسبة</h1>
        <Button variant="primary">
          <Plus className="w-4 h-4 ml-2" />
          قيد يومية جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">إجمالي المدين</p>
              <p className="text-2xl font-bold text-gray-900">{totalDebits.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">إجمالي الدائن</p>
              <p className="text-2xl font-bold text-gray-900">{totalCredits.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">الرصيد</p>
              <p className="text-2xl font-bold text-gray-900">{(totalDebits - totalCredits).toFixed(2)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">الحسابات</h2>
        <Table
          columns={[
            { header: "الكود", accessor: "code" },
            { header: "الاسم", accessor: "name" },
            { 
              header: "النوع", 
              accessor: "type",
              render: (value: string) => (
                <Badge variant="default">{value}</Badge>
              )
            },
            { header: "الرصيد", accessor: "balance" },
            { 
              header: "الحالة", 
              accessor: "isActive",
              render: (value: boolean) => (
                <Badge variant={value ? "default" : "secondary"}>
                  {value ? "نشط" : "غير نشط"}
                </Badge>
              )
            },
          ]}
          data={accounts}
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">القيود اليومية</h2>
        <Table
          columns={[
            { header: "التاريخ", accessor: "date", render: (date: string) => new Date(date).toLocaleDateString('ar-EG') },
            { header: "الوصف", accessor: "description" },
            { header: "المرجع", accessor: "reference" },
            { 
              header: "المدين", 
              render: (row: any) => row.lines.reduce((sum: number, line: any) => sum + (line.debit || 0), 0).toFixed(2)
            },
            { 
              header: "الدائن", 
              render: (row: any) => row.lines.reduce((sum: number, line: any) => sum + (line.credit || 0), 0).toFixed(2)
            },
          ]}
          data={journalEntries}
        />
      </div>
    </div>
  );
}
