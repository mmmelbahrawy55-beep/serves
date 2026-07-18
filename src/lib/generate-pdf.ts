import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateReportPDF(type: string, title: string) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(20);
  doc.text(title, pageWidth / 2, 20, { align: "center" });

  doc.setFontSize(10);
  doc.text(`تاريخ التقرير: ${new Date().toLocaleDateString("ar-EG")}`, pageWidth / 2, 28, {
    align: "center",
  });

  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.5);
  doc.line(20, 32, pageWidth - 20, 32);

  switch (type) {
    case "sales":
      generateSalesReport(doc);
      break;
    case "employees":
      generateEmployeesReport(doc);
      break;
    case "inventory":
      generateInventoryReport(doc);
      break;
    case "financial":
      generateFinancialReport(doc);
      break;
  }

  doc.setFontSize(8);
  doc.text(`تم الإنشاء بواسطة: نظام إدارة الشركات - ${new Date().toLocaleString("ar-EG")}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });

  doc.save(`${type}-report.pdf`);
}

function generateSalesReport(doc: jsPDF) {
  const data = [
    ["يناير", "45,000"],
    ["فبراير", "52,000"],
    ["مارس", "38,000"],
    ["أبريل", "61,000"],
    ["مايو", "48,000"],
    ["يونيو", "72,000"],
  ];

  autoTable(doc, {
    head: [["الشهر", "المبيعات (ج.م)"]],
    body: data,
    startY: 38,
    theme: "grid",
    headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: "bold" },
    styles: { halign: "right" },
    foot: [["الإجمالي", "316,000"]],
    footStyles: { fillColor: [243, 244, 246], textColor: 0, fontStyle: "bold" },
  });
}

function generateEmployeesReport(doc: jsPDF) {
  const data = [
    ["تقنية", "25", "31%"],
    ["مبيعات", "18", "23%"],
    ["موارد بشرية", "10", "13%"],
    ["مالية", "8", "10%"],
    ["تسويق", "12", "15%"],
  ];

  autoTable(doc, {
    head: [["القسم", "عدد الموظفين", "النسبة"]],
    body: data,
    startY: 38,
    theme: "grid",
    headStyles: { fillColor: [16, 185, 129], textColor: 255, fontStyle: "bold" },
    styles: { halign: "right" },
    foot: [["الإجمالي", "73", "100%"]],
    footStyles: { fillColor: [243, 244, 246], textColor: 0, fontStyle: "bold" },
  });
}

function generateInventoryReport(doc: jsPDF) {
  const data = [
    ["إلكترونيات", "350", "35%"],
    ["ملابس", "250", "25%"],
    ["مواد خام", "200", "20%"],
    ["أخرى", "150", "15%"],
  ];

  autoTable(doc, {
    head: [["التصنيف", "الكمية", "النسبة"]],
    body: data,
    startY: 38,
    theme: "grid",
    headStyles: { fillColor: [245, 158, 11], textColor: 255, fontStyle: "bold" },
    styles: { halign: "right" },
    foot: [["الإجمالي", "950", "100%"]],
    footStyles: { fillColor: [243, 244, 246], textColor: 0, fontStyle: "bold" },
  });
}

function generateFinancialReport(doc: jsPDF) {
  autoTable(doc, {
    head: [["الشهر", "الإيرادات", "المصروفات", "صافي الربح"]],
    body: [
      ["يناير", "65,000", "42,000", "23,000"],
      ["فبراير", "72,000", "45,000", "27,000"],
      ["مارس", "58,000", "38,000", "20,000"],
      ["أبريل", "81,000", "51,000", "30,000"],
      ["مايو", "68,000", "43,000", "25,000"],
      ["يونيو", "92,000", "55,000", "37,000"],
    ],
    startY: 38,
    theme: "grid",
    headStyles: { fillColor: [139, 92, 246], textColor: 255, fontStyle: "bold" },
    styles: { halign: "right" },
    foot: [["الإجمالي", "436,000", "274,000", "162,000"]],
    footStyles: { fillColor: [243, 244, 246], textColor: 0, fontStyle: "bold" },
  });
}
