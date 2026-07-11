export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
}

export interface DashboardStats {
  totalEmployees: number;
  totalClients: number;
  totalInvoices: number;
  totalRevenue: number;
  pendingInvoices: number;
  lowStockProducts: number;
  activeProjects: number;
  pendingLeaves: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
  }[];
}

export type StatusColor = {
  [key: string]: string;
};

export const INVOICE_STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  SENT: "bg-blue-100 text-blue-700",
  PAID: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  OVERDUE: "bg-orange-100 text-orange-700",
};
