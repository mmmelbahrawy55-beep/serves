# نظام إدارة الشركات

نظام متكامل لإدارة الشركات والمؤسسات مع واجهة عصرية وسهولة استخدام.

## المميزات

- ✅ إدارة الموظفين (إضافة، تعديل، حذف)
- ✅ إدارة العملاء والعلاقات
- ✅ إدارة المخزون (المنتجات، الموردين، الفئات)
- ✅ المحاسبة (الحسابات، القيود اليومية)
- ✅ إدارة الحضور والانصراف
- ✅ نظام الرواتب
- ✅ إدارة المشاريع والمهام
- ✅ التقارير والرسوم البيانية
- ✅ إدارة المبيعات والفواتير
- ✅ إعدادات النظام

## التقنيات المستخدمة

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** TailwindCSS
- **Database:** Prisma ORM + SQLite (Development) / PostgreSQL (Production)
- **Authentication:** JWT
- **UI Components:** Lucide Icons, Framer Motion, Sonner
- **Charts:** Recharts
- **State Management:** Zustand

## التثبيت والتشغيل

### المتطلبات

- Node.js 18 أو أحدث
- npm أو yarn أو pnpm

### خطوات التثبيت

1. استنساخ المشروع:
```bash
git clone <repository-url>
cd company-management-system
```

2. تثبيت المكتبات:
```bash
npm install
```

3. إعداد المتغيرات البيئية:
```bash
cp .env.example .env
```
ثم قم بتعديل ملف `.env` ببياناتك الخاصة

4. إعداد قاعدة البيانات:
```bash
# إنشاء قاعدة البيانات
npx prisma db push

# أو استخدام Migrations
npx prisma migrate dev

# تشغيل البيانات التجريبية
npm run db:seed
```

5. تشغيل المشروع:
```bash
npm run dev
```

افتح المتصفح على `http://localhost:3000`

## النشر على السيرفر (Production)

### التحضير للإنتاج

1. **تغيير قاعدة البيانات:**
   - استخدم PostgreSQL أو MySQL بدلاً من SQLite
   - عدل `DATABASE_URL` في ملف `.env.production`

2. **إنشاء ملف البيئة:**
```bash
cp .env.example .env.production
```
عدل القيم لبيانات الإنتاج

3. **بناء المشروع:**
```bash
npm run build
```

4. **تشغيل في وضع الإنتاج:**
```bash
npm start
```

### النشر على Vercel

1. **إعداد قاعدة البيانات:**
   - في Vercel، اضغط "Storage" → "Create Database"
   - اختر "Postgres"
   - بعد الإنشاء، انسخ `DATABASE_URL` من إعدادات الـ Database

2. **ربط المشروع:**
   - ادفع المشروع إلى GitHub
   - اذهب إلى [vercel.com](https://vercel.com) وسجل الدخول
   - اضغط "Add New Project"
   - اختر المستودع: `mmmelbahrawy55-beep/serves`

3. **إضافة المتغيرات البيئية:**
   في إعدادات Vercel (Environment Variables)، أضف:
   ```
   DATABASE_URL = postgresql://user:password@host:5432/dbname
   JWT_SECRET = your-super-secret-jwt-key-here
   ```

4. **النشر:**
   - اضغط "Deploy"
   - انتظر حتى يكتمل البناء

5. **إنشاء الجداول:**
   بعد النشر، قم بإنشاء الجداول:
   ```bash
   npx prisma db push
   ```

### النشر على خادم خاص

1. بناء المشروع:
```bash
npm run build
```

2. استخدام PM2 لإدارة العملية:
```bash
npm install -g pm2
pm2 start npm --name "company-system" -- start
```

3. إعداد Nginx كـ Reverse Proxy (اختياري)

## الأوامر المتاحة

```bash
# التطوير
npm run dev

# البناء
npm run build

# التشغيل في الإنتاج
npm start

# قاعدة البيانات
npm run db:push      # تطبيق Schema على قاعدة البيانات
npm run db:studio    # فتح Prisma Studio
npm run db:seed      # تشغيل البيانات التجريبية

# التحقق من الكود
npm run lint
```

## بيانات الدخول الافتراضية

بعد تشغيل البيانات التجريبية:
- **البريد الإلكتروني:** admin@company.com
- **كلمة المرور:** admin123

## الدعم

للدعم والاستفسارات، يرجى التواصل مع فريق التطوير.

## الترخيص

هذا المشروع مرخص للاستخدام الداخلي للشركة.
