# إعداد خرائط جوجل (Google Maps Setup)

## الخطوات المطلوبة:

### 1. الحصول على مفتاح API
1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. أنشئ مشروع جديد أو اختر مشروع موجود
3. فعل الـ APIs التالية:
   - Maps JavaScript API
   - Places API
   - Geocoding API

### 2. إنشاء مفتاح API
1. اذهب إلى "Credentials" في Google Cloud Console
2. انقر على "Create Credentials" > "API Key"
3. انسخ المفتاح

### 3. إضافة المفتاح للمشروع
أنشئ ملف `.env.local` في جذر المشروع وأضف:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### 4. إعادة تشغيل الخادم
```bash
npm run dev
```

## ملاحظات:
- لا تشارك مفتاح API مع أحد
- يمكنك تقييد المفتاح لنطاقك فقط في Google Cloud Console
- إذا كنت تختبر محلياً، أضف `localhost` في القيود

## البديل المؤقت:
إذا لم تريد استخدام Google Maps حالياً، يمكنك استخدام الخريطة التفاعلية فقط.
