"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-sm">
        <CardContent className="p-8 text-center space-y-4">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="h-7 w-7 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">حدث خطأ</h2>
            <p className="text-gray-500 mt-2 text-sm">
              {error.message || "حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى"}
            </p>
          </div>
          <Button variant="primary" onClick={() => reset()}>
            حاول مرة أخرى
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
