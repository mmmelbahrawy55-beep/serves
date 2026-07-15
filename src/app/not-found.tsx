"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-sm">
        <CardContent className="p-8 text-center space-y-4">
          <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="h-7 w-7 text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">الصفحة غير موجودة</h2>
            <p className="text-gray-500 mt-2 text-sm">
              الصفحة التي تبحث عنها غير موجودة أو تم نقلها
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="primary">الذهاب إلى لوحة التحكم</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
