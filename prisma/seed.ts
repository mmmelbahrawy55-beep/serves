import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 بدء عملية البذر...");

  await prisma.$transaction(async (tx) => {
    // Clean existing data
    await tx.journalLine.deleteMany();
    await tx.journalEntry.deleteMany();
    await tx.account.deleteMany();
    await tx.invoiceItem.deleteMany();
    await tx.invoice.deleteMany();
    await tx.task.deleteMany();
    await tx.project.deleteMany();
    await tx.interaction.deleteMany();
    await tx.client.deleteMany();
    await tx.purchaseItem.deleteMany();
    await tx.purchase.deleteMany();
    await tx.product.deleteMany();
    await tx.category.deleteMany();
    await tx.supplier.deleteMany();
    await tx.payroll.deleteMany();
    await tx.leave.deleteMany();
    await tx.attendance.deleteMany();
    await tx.notification.deleteMany();
    await tx.user.deleteMany();
  });

  const passwordHash = await bcrypt.hash("password123", 12);

  // Users
  const admin = await prisma.user.create({
    data: {
      name: "المدير العام",
      email: "admin@company.com",
      phone: "0123456789",
      passwordHash,
      role: "ADMIN",
      department: "الإدارة العليا",
      position: "مدير عام",
      salary: 25000,
      status: "ACTIVE",
    },
  });

  const manager = await prisma.user.create({
    data: {
      name: "أحمد محمد",
      email: "manager@company.com",
      phone: "0123456790",
      passwordHash,
      role: "MANAGER",
      department: "إدارة المشاريع",
      position: "مدير مشاريع",
      salary: 18000,
      status: "ACTIVE",
    },
  });

  const employees = await Promise.all([
    prisma.user.create({
      data: {
        name: "سارة علي",
        email: "sara@company.com",
        phone: "0123456791",
        passwordHash,
        role: "EMPLOYEE",
        department: "المبيعات",
        position: "مندوب مبيعات",
        salary: 8000,
        status: "ACTIVE",
      },
    }),
    prisma.user.create({
      data: {
        name: "خالد عمر",
        email: "khaled@company.com",
        phone: "0123456792",
        passwordHash,
        role: "EMPLOYEE",
        department: "المحاسبة",
        position: "محاسب",
        salary: 9000,
        status: "ACTIVE",
      },
    }),
    prisma.user.create({
      data: {
        name: "نورة أحمد",
        email: "noura@company.com",
        phone: "0123456793",
        passwordHash,
        role: "EMPLOYEE",
        department: "الموارد البشرية",
        position: "أخصائي موارد بشرية",
        salary: 8500,
        status: "ACTIVE",
      },
    }),
    prisma.user.create({
      data: {
        name: "فيصل محمد",
        email: "faisal@company.com",
        phone: "0123456794",
        passwordHash,
        role: "EMPLOYEE",
        department: "تقنية المعلومات",
        position: "مطور برمجيات",
        salary: 12000,
        status: "ACTIVE",
      },
    }),
    prisma.user.create({
      data: {
        name: "هند عبدالله",
        email: "hind@company.com",
        phone: "0123456795",
        passwordHash,
        role: "EMPLOYEE",
        department: "التسويق",
        position: "أخصائي تسويق",
        salary: 7500,
        status: "INACTIVE",
      },
    }),
  ]);

  console.log(`✅ تم إنشاء ${employees.length + 2} مستخدم`);

  // Clients
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        name: "شركة الأفق للتجارة",
        email: "info@alouf.com",
        phone: "0123456710",
        company: "شركة الأفق للتجارة",
        type: "CUSTOMER",
        status: "ACTIVE",
        notes: "عميل منتظم - لديه عقد صيانة سنوي",
        createdById: admin.id,
      },
    }),
    prisma.client.create({
      data: {
        name: "مؤسسة النور للمقاولات",
        email: "info@alnoor.com",
        phone: "0123456711",
        company: "مؤسسة النور للمقاولات",
        type: "CUSTOMER",
        status: "ACTIVE",
        notes: "عميل مهم - مشاريع كبيرة",
        createdById: admin.id,
      },
    }),
    prisma.client.create({
      data: {
        name: "شركة البناء الحديث",
        email: "info@modernbuild.com",
        phone: "0123456712",
        company: "شركة البناء الحديث",
        type: "LEAD",
        status: "ACTIVE",
        notes: "عميل محتمل - في مرحلة التفاوض",
        createdById: manager.id,
      },
    }),
    prisma.client.create({
      data: {
        name: "مكتب السلام للاستشارات",
        email: "info@alsalam.com",
        phone: "0123456713",
        company: "مكتب السلام للاستشارات",
        type: "CUSTOMER",
        status: "ACTIVE",
        notes: "خدمات استشارية شهرية",
        createdById: manager.id,
      },
    }),
    prisma.client.create({
      data: {
        name: "شركة التقدم التقني",
        email: "info@altaqaddom.com",
        phone: "0123456714",
        company: "شركة التقدم التقني",
        type: "LEAD",
        status: "INACTIVE",
        notes: "تم التواصل سابقاً - بحاجة لمتابعة",
        createdById: admin.id,
      },
    }),
  ]);

  console.log(`✅ تم إنشاء ${clients.length} عميل`);

  // Categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: "إلكترونيات", description: "المنتجات الإلكترونية" } }),
    prisma.category.create({ data: { name: "قرطاسية", description: "القرطاسية والمكتب" } }),
    prisma.category.create({ data: { name: "أثاث", description: "الأثاث المكتبي" } }),
  ]);

  console.log(`✅ تم إنشاء ${categories.length} تصنيف`);

  // Suppliers
  const suppliers = await Promise.all([
    prisma.supplier.create({
      data: {
        name: "شركة التقنية للتوريدات",
        email: "supply@tech.com",
        phone: "0123456701",
        address: "الرياض، المملكة العربية السعودية",
        notes: "مورد رئيسي للإلكترونيات",
      },
    }),
    prisma.supplier.create({
      data: {
        name: "مؤسسة المكتب المتكامل",
        email: "office@integrated.com",
        phone: "0123456702",
        address: "جدة، المملكة العربية السعودية",
        notes: "توريد القرطاسية والأثاث",
      },
    }),
  ]);

  console.log(`✅ تم إنشاء ${suppliers.length} مورد`);

  // Products
  const products = await Promise.all([
    prisma.product.create({
      data: { name: "حاسوب محمول", sku: "LPT-001", unitPrice: 4500, costPrice: 3800, quantity: 15, minStock: 5, categoryId: categories[0].id, supplierId: suppliers[0].id, description: "حاسوب محمول 15.6 بوصة" },
    }),
    prisma.product.create({
      data: { name: "شاشة عرض", sku: "MON-001", unitPrice: 1200, costPrice: 900, quantity: 20, minStock: 5, categoryId: categories[0].id, supplierId: suppliers[0].id, description: "شاشة عرض 24 بوصة" },
    }),
    prisma.product.create({
      data: { name: "لوحة مفاتيح", sku: "KBD-001", unitPrice: 150, costPrice: 100, quantity: 50, minStock: 10, categoryId: categories[0].id, supplierId: suppliers[0].id, description: "لوحة مفاتيح لاسلكية" },
    }),
    prisma.product.create({
      data: { name: "فارة (ماوس)", sku: "MOU-001", unitPrice: 80, costPrice: 50, quantity: 60, minStock: 10, categoryId: categories[0].id, supplierId: suppliers[0].id, description: "فارة بصرية" },
    }),
    prisma.product.create({
      data: { name: "طابعة متعددة الوظائف", sku: "PRN-001", unitPrice: 2500, costPrice: 2000, quantity: 8, minStock: 3, categoryId: categories[0].id, supplierId: suppliers[0].id, description: "طابعة ليزر A4" },
    }),
    prisma.product.create({
      data: { name: "ورق طباعة A4", sku: "PAP-001", unitPrice: 25, costPrice: 18, quantity: 200, minStock: 50, categoryId: categories[1].id, supplierId: suppliers[1].id, description: "كرتون ورق طباعة 5000 ورقة" },
    }),
    prisma.product.create({
      data: { name: "أقلام حبر", sku: "PEN-001", unitPrice: 5, costPrice: 3, quantity: 500, minStock: 100, categoryId: categories[1].id, supplierId: suppliers[1].id, description: "علبة أقلام حبر زرقاء (10 قطع)" },
    }),
    prisma.product.create({
      data: { name: "مكتب خشبي", sku: "DSK-001", unitPrice: 1800, costPrice: 1300, quantity: 10, minStock: 2, categoryId: categories[2].id, supplierId: suppliers[1].id, description: "مكتب إداري خشبي" },
    }),
    prisma.product.create({
      data: { name: "كرسي مكتب", sku: "CHR-001", unitPrice: 1200, costPrice: 850, quantity: 15, minStock: 3, categoryId: categories[2].id, supplierId: suppliers[1].id, description: "كرسي مكتب مريح" },
    }),
    prisma.product.create({
      data: { name: "خزانة مستندات", sku: "CAB-001", unitPrice: 2200, costPrice: 1700, quantity: 5, minStock: 1, categoryId: categories[2].id, supplierId: suppliers[1].id, description: "خزانة معدنية 4 أدراج" },
    }),
  ]);

  console.log(`✅ تم إنشاء ${products.length} منتج`);

  // Chart of Accounts
  const accountData = [
    { code: "1001", name: "نقدية", type: "ASSET" as const, balance: 50000 },
    { code: "1002", name: "بنك", type: "ASSET" as const, balance: 250000 },
    { code: "1003", name: "حسابات مدينة", type: "ASSET" as const, balance: 75000 },
    { code: "1004", name: "مخزون", type: "ASSET" as const, balance: 120000 },
    { code: "1005", name: "أصول ثابتة", type: "ASSET" as const, balance: 300000 },
    { code: "2001", name: "حسابات دائنة", type: "LIABILITY" as const, balance: 45000 },
    { code: "2002", name: "قروض", type: "LIABILITY" as const, balance: 100000 },
    { code: "3001", name: "رأس المال", type: "EQUITY" as const, balance: 500000 },
    { code: "3002", name: "أرباح محتجزة", type: "EQUITY" as const, balance: 150000 },
    { code: "4001", name: "إيرادات مبيعات", type: "INCOME" as const, balance: 0 },
    { code: "4002", name: "إيرادات خدمات", type: "INCOME" as const, balance: 0 },
    { code: "5001", name: "رواتب", type: "EXPENSE" as const, balance: 0 },
    { code: "5002", name: "إيجار", type: "EXPENSE" as const, balance: 0 },
    { code: "5003", name: "كهرباء", type: "EXPENSE" as const, balance: 0 },
    { code: "5004", name: "اتصالات", type: "EXPENSE" as const, balance: 0 },
    { code: "5005", name: "مصروفات أخرى", type: "EXPENSE" as const, balance: 0 },
  ];

  const accounts = await Promise.all(
    accountData.map((a) => prisma.account.create({ data: a }))
  );

  console.log(`✅ تم إنشاء ${accounts.length} حساب`);

  // Invoices
  const inv1 = await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-2026-0001",
      clientId: clients[0].id,
      date: new Date("2026-06-01"),
      dueDate: new Date("2026-07-01"),
      subtotal: 5700,
      taxRate: 15,
      taxAmount: 855,
      discount: 0,
      totalAmount: 6555,
      status: "PAID",
      notes: "فاتورة أجهزة حاسوب",
      createdById: admin.id,
      items: {
        create: [
          {
            productId: products[0].id,
            description: "حاسوب محمول 15.6 بوصة",
            quantity: 1,
            unitPrice: 4500,
            total: 4500,
          },
          {
            productId: products[2].id,
            description: "لوحة مفاتيح لاسلكية",
            quantity: 2,
            unitPrice: 150,
            total: 300,
          },
          {
            productId: products[3].id,
            description: "فارة بصرية",
            quantity: 2,
            unitPrice: 80,
            total: 160,
          },
          {
            description: "خدمة تركيب وتشغيل",
            quantity: 1,
            unitPrice: 740,
            total: 740,
          },
        ],
      },
    },
  });

  const inv2 = await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-2026-0002",
      clientId: clients[3].id,
      date: new Date("2026-06-15"),
      dueDate: new Date("2026-07-15"),
      subtotal: 3000,
      taxRate: 15,
      taxAmount: 450,
      discount: 200,
      totalAmount: 3250,
      status: "SENT",
      notes: "فاتورة استشارات شهر يونيو",
      createdById: manager.id,
      items: {
        create: [
          {
            description: "استشارات إدارية - شهر يونيو",
            quantity: 1,
            unitPrice: 3000,
            total: 3000,
          },
        ],
      },
    },
  });

  console.log(`✅ تم إنشاء فاتورتين`);

  // Project
  const project = await prisma.project.create({
    data: {
      name: "تطوير منصة إلكترونية",
      description: "تطوير منصة للتجارة الإلكترونية للشركة",
      startDate: new Date("2026-05-01"),
      endDate: new Date("2026-09-30"),
      status: "IN_PROGRESS",
      budget: 150000,
      clientId: clients[0].id,
      managerId: manager.id,
      tasks: {
        create: [
          { name: "تحليل المتطلبات", assignedTo: employees[3].id, status: "DONE", priority: "HIGH", dueDate: new Date("2026-05-15") },
          { name: "تصميم قاعدة البيانات", assignedTo: employees[3].id, status: "DONE", priority: "HIGH", dueDate: new Date("2026-06-01") },
          { name: "تطوير واجهة المستخدم", assignedTo: employees[3].id, status: "IN_PROGRESS", priority: "HIGH", dueDate: new Date("2026-07-15") },
          { name: "تطوير لوحة التحكم", assignedTo: null, status: "TODO", priority: "MEDIUM", dueDate: new Date("2026-08-01") },
          { name: "اختبار النظام", assignedTo: null, status: "TODO", priority: "MEDIUM", dueDate: new Date("2026-09-01") },
          { name: "نشر وتشغيل", assignedTo: null, status: "TODO", priority: "URGENT", dueDate: new Date("2026-09-20") },
        ],
      },
    },
  });

  console.log(`✅ تم إنشاء مشروع واحد مع 6 مهام`);

  // Attendance records
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  await Promise.all([
    prisma.attendance.create({
      data: {
        employeeId: employees[0].id,
        date: yesterday,
        checkIn: new Date(yesterday.setHours(8, 30, 0)),
        checkOut: new Date(yesterday.setHours(17, 0, 0)),
        status: "PRESENT",
      },
    }),
    prisma.attendance.create({
      data: {
        employeeId: employees[1].id,
        date: yesterday,
        checkIn: new Date(yesterday.setHours(9, 15, 0)),
        checkOut: new Date(yesterday.setHours(17, 30, 0)),
        status: "LATE",
      },
    }),
    prisma.attendance.create({
      data: {
        employeeId: employees[2].id,
        date: yesterday,
        checkIn: new Date(yesterday.setHours(8, 0, 0)),
        checkOut: new Date(yesterday.setHours(16, 30, 0)),
        status: "PRESENT",
      },
    }),
    prisma.attendance.create({
      data: {
        employeeId: employees[3].id,
        date: today,
        checkIn: new Date(today.setHours(8, 45, 0)),
        status: "PRESENT",
      },
    }),
  ]);

  console.log(`✅ تم إنشاء 4 سجلات حضور`);

  // Payroll records
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  await Promise.all([
    prisma.payroll.create({
      data: {
        employeeId: employees[0].id,
        month: currentMonth,
        year: currentYear,
        basicSalary: 8000,
        allowances: 800,
        deductions: 400,
        netSalary: 8400,
        status: "PAID",
        paidDate: new Date(),
      },
    }),
    prisma.payroll.create({
      data: {
        employeeId: employees[1].id,
        month: currentMonth,
        year: currentYear,
        basicSalary: 9000,
        allowances: 900,
        deductions: 450,
        netSalary: 9450,
        status: "PENDING",
      },
    }),
    prisma.payroll.create({
      data: {
        employeeId: employees[2].id,
        month: currentMonth,
        year: currentYear,
        basicSalary: 8500,
        allowances: 850,
        deductions: 425,
        netSalary: 8925,
        status: "PENDING",
      },
    }),
    prisma.payroll.create({
      data: {
        employeeId: employees[3].id,
        month: currentMonth,
        year: currentYear,
        basicSalary: 12000,
        allowances: 1200,
        deductions: 600,
        netSalary: 12600,
        status: "PAID",
        paidDate: new Date(),
      },
    }),
  ]);

  console.log(`✅ تم إنشاء 4 سجلات رواتب`);

  // System settings
  await Promise.all([
    prisma.systemSetting.create({
      data: { key: "companyName", value: "شركة التقدم التقني" },
    }),
    prisma.systemSetting.create({
      data: { key: "companyEmail", value: "info@altaqaddom.com" },
    }),
    prisma.systemSetting.create({
      data: { key: "companyPhone", value: "0123456789" },
    }),
    prisma.systemSetting.create({
      data: { key: "companyAddress", value: "الرياض، المملكة العربية السعودية" },
    }),
    prisma.systemSetting.create({
      data: { key: "currency", value: "SAR" },
    }),
    prisma.systemSetting.create({
      data: { key: "language", value: "ar" },
    }),
    prisma.systemSetting.create({
      data: { key: "timezone", value: "Asia/Riyadh" },
    }),
    prisma.systemSetting.create({
      data: { key: "taxRate", value: "15" },
    }),
    prisma.systemSetting.create({
      data: { key: "lowStockAlert", value: "true" },
    }),
    prisma.systemSetting.create({
      data: { key: "emailNotifications", value: "true" },
    }),
  ]);

  console.log(`✅ تم إنشاء 10 إعدادات نظام`);

  console.log("🎉 تمت عملية البذر بنجاح!");
}

main()
  .catch((e) => {
    console.error("❌ خطأ أثناء البذر:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
