# 🏥 قاعدة بيانات عيادة الأسنان - Database Setup

## 📋 الإعدادات المطلوبة (Prerequisites)

- SQL Server 2019 أو أحدث
- SQL Server Management Studio (SSMS)
- Windows Authentication متفعل

## 🚀 خطوات التثبيت (Installation Steps)

### 1. فتح قاعدة البيانات (Open Database)

```sql
-- إذا كانت قاعدة البيانات موجودة بالفعل
DROP DATABASE IF EXISTS clinic_db;

-- إنشاء قاعدة البيانات الجديدة
CREATE DATABASE clinic_db;
USE clinic_db;
```

### 2. تنفيذ ملف الـ Script

1. افتح **SQL Server Management Studio**
2. Connect to your SQL Server instance
3. اضغط على **File → Open → File**
4. اختر ملف `Clinc.sql`
5. اضغط **Execute** أو اضغط `F5`

أو عن طريق Command Line:

```bash
sqlcmd -S YOUR_SERVER_NAME -U sa -P YOUR_PASSWORD -i Clinc.sql
```

### 3. التحقق من التثبيت (Verification)

```sql
-- تحقق من الجداول
SELECT * FROM doctors;
SELECT * FROM patients;
SELECT * FROM appointments;
```

## 🗄️ هيكل البيانات (Database Schema)

### جدول الأطباء (Doctors Table)
| Column | Type | Notes |
|--------|------|-------|
| id | INT (PK, Identity) | معرف فريد |
| name | VARCHAR(100) | اسم الطبيب |
| specialization | VARCHAR(100) | التخصص |

### جدول المرضى (Patients Table)
| Column | Type | Notes |
|--------|------|-------|
| id | INT (PK, Identity) | معرف فريد |
| name | VARCHAR(100) | اسم المريض |
| phone | VARCHAR(20) | رقم الهاتف |
| email | VARCHAR(100) | البريد الإلكتروني (فريد) |

### جدول المواعيد (Appointments Table)
| Column | Type | Notes |
|--------|------|-------|
| id | INT (PK, Identity) | معرف فريد |
| patient_id | INT (FK) | معرف المريض |
| doctor_id | INT (FK) | معرف الطبيب |
| date | DATE | تاريخ الموعد |

## 🔗 العلاقات (Relationships)

- **Appointments → Patients**: Many-to-One (علاقة من-إلى-كثير)
  - `ON DELETE CASCADE`: حذف المواعيد عند حذف المريض
  
- **Appointments → Doctors**: Many-to-One
  - `ON DELETE CASCADE`: حذف المواعيد عند حذف الطبيب

## 📊 البيانات الأساسية (Sample Data)

### الأطباء (5 Doctors)
1. Dr. Ahmed Hassan - Cardiology
2. Dr. Sara Mahmoud - Dermatology
3. Dr. Omar Khaled - Orthopedics
4. Dr. Nadia Farouk - Pediatrics
5. Dr. Youssef Nabil - Neurology

### المرضى (5 Patients)
1. Mohamed Ali
2. Hana Mostafa
3. Karim Samy
4. Laila Adel
5. Tarek Ibrahim

### المواعيد (5 Appointments)
جميعها في أغسطس 2025

## 🐛 استكشاف الأخطاء (Troubleshooting)

### خطأ: "Database already exists"
```sql
DROP DATABASE clinic_db;
-- ثم قم بتشغيل Clinc.sql مجددًا
```

### خطأ: "Permission denied"
- تأكد من استخدام Admin account
- أو استخدم `USE master;` أولاً

### خطأ: "Invalid object name"
- تأكد من تشغيل Script بالكامل
- لا تقطع التنفيذ في النصف

## 📝 ملاحظات مهمة

✅ جميع البيانات محفوظة كما هي  
✅ الـ IDs تبدأ من 1  
✅ لا توجد قيود تاريخية  
✅ يمكن إضافة مواعيد مستقبلية وماضية  

## 🔄 إعادة تعيين البيانات (Reset Data)

إذا أردت العودة للبيانات الأصلية:

```sql
USE clinic_db;

-- حذف جميع البيانات
DELETE FROM appointments;
DELETE FROM patients;
DELETE FROM doctors;

-- إعادة تعيين IDs
DBCC CHECKIDENT ('doctors', RESEED, 0);
DBCC CHECKIDENT ('patients', RESEED, 0);
DBCC CHECKIDENT ('appointments', RESEED, 0);

-- ثم قم بتشغيل Clinc.sql again
```

## 📞 دعم تقني (Support)

للمساعدة في إعدادات قاعدة البيانات، يرجى التحقق من:
- SQL Server logs (Event Viewer)
- SSMS messages tab
- Console output من sqlcmd
