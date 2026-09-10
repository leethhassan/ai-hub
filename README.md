# AI Hub

منصة ويب عربية تجمع عدة أدوات ذكاء اصطناعي في مكان واحد: محادثة، كتابة، تلخيص، ترجمة، توليد
صور، تحويل صوت إلى نص، تحليل ملفات، ومساعد برمجي — مبنية بـ Next.js وTypeScript وTailwind CSS
وSupabase.

## 1. فكرة المشروع

يسجّل المستخدم حسابًا ويستخدم الأدوات ضمن خطة مجانية بحدود استخدام يومية تُفرض من الخادم (وليس
من المتصفح). البنية معدّة للتوسع لاحقًا بخطط مدفوعة (Pro / Business).

## 2. المتطلبات

- Node.js 20 أو أحدث
- حساب Supabase مجاني
- مفتاح API من مزود ذكاء اصطناعي (OpenAI افتراضيًا)

## 3. إنشاء مشروع Supabase

1. اذهب إلى [supabase.com](https://supabase.com) وأنشئ حسابًا ثم مشروعًا جديدًا.
2. من **Project Settings → API** انسخ:
   - `Project URL` → يوضع في `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → يوضع في `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → يوضع في `SUPABASE_SERVICE_ROLE_KEY` (سرّي، لا يُستخدم في المتصفح أبدًا)
3. من **SQL Editor** الصق محتوى الملف `supabase/migrations/0001_init.sql` بالكامل ثم اضغط Run.
   هذا ينشئ الجداول، الفهارس، وسياسات Row Level Security، وحاوية تخزين الملفات.
4. (اختياري) لجعل مستخدم معيّنًا مسؤول Admin، نفّذ في SQL Editor:
   ```sql
   update public.profiles set role = 'admin' where email = 'you@example.com';
   ```

## 4. متغيرات البيئة

انسخ `.env.example` إلى `.env.local` واملأ القيم:

```bash
cp .env.example .env.local
```

| المتغير | الوصف | مطلوب؟ |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | رابط مشروع Supabase | نعم |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | المفتاح العام لـ Supabase | نعم |
| `SUPABASE_SERVICE_ROLE_KEY` | مفتاح Supabase السرّي (خادم فقط) | نعم |
| `AI_PROVIDER` | اسم مزود الذكاء الاصطناعي (`openai` حاليًا) | نعم |
| `OPENAI_API_KEY` | مفتاح OpenAI API | نعم لاستخدام الأدوات |
| `OPENAI_CHAT_MODEL` | نموذج المحادثة (افتراضي `gpt-4o-mini`) | لا |
| `OPENAI_IMAGE_MODEL` | نموذج توليد الصور (افتراضي `dall-e-3`) | لا |
| `OPENAI_TRANSCRIBE_MODEL` | نموذج تحويل الصوت (افتراضي `whisper-1`) | لا |
| `NEXT_PUBLIC_SITE_URL` | رابط الموقع (للـ SEO) | لا |

**لا تضع أي مفتاح API داخل الكود مباشرة — كل المفاتيح تُقرأ من متغيرات البيئة فقط.**

## 5. التشغيل محليًا

```bash
npm install
npm run dev
```

افتح `http://localhost:3000`.

## 6. رفع المشروع إلى GitHub

```bash
git init
git add .
git commit -m "Initial commit: AI Hub"
git branch -M main
git remote add origin https://github.com/USERNAME/ai-hub.git
git push -u origin main
```

تأكد أن `.env.local` غير مرفوع (موجود ضمن `.gitignore`).

## 7. النشر على Vercel

1. اذهب إلى [vercel.com](https://vercel.com) وسجّل الدخول عبر GitHub.
2. اضغط **New Project** واختر مستودع `ai-hub`.
3. في **Environment Variables** أضف كل المتغيرات المذكورة أعلاه (بنفس القيم من `.env.local`).
4. اضغط **Deploy**. بعد اكتمال النشر سيكون الموقع متاحًا على رابط `*.vercel.app`.
5. حدّث `NEXT_PUBLIC_SITE_URL` إلى رابط النشر النهائي وأعد النشر.

## 8. كيفية تغيير مزود الذكاء الاصطناعي

طبقة الذكاء الاصطناعي معزولة في `lib/ai/`. لإضافة مزود جديد:

1. أنشئ ملفًا جديدًا في `lib/ai/providers/<name>.ts` يطبّق واجهة `AIProvider`
   (`chat`, `chatStream`, `generateImage`, `transcribe`).
2. سجّله في `lib/ai/index.ts` ضمن كائن `providers`.
3. غيّر قيمة `AI_PROVIDER` في متغيرات البيئة إلى اسم المزود الجديد.

لا حاجة لتعديل أي API route عند تغيير المزود.

## 9. اختبار الأدوات

بعد تسجيل الدخول، من `/dashboard`:

| الأداة | الرابط | كيفية الاختبار |
|---|---|---|
| AI Chat | `/dashboard/chat` | أرسل رسالة وتحقق من ظهور الرد تدريجيًا (streaming) |
| AI Writer | `/dashboard/writer` | اختر نوع محتوى واضغط "إنشاء" |
| Summarizer | `/dashboard/summarizer` | ألصق نصًا أو ارفع PDF/TXT واضغط "تلخيص" |
| Translator | `/dashboard/translator` | اكتب نصًا واختر لغتين ثم اضغط "ترجمة" |
| Image Generator | `/dashboard/image-generator` | اكتب وصفًا واضغط "Generate Image" |
| Speech to Text | `/dashboard/speech` | ارفع ملفًا صوتيًا وانتظر النص |
| File Analyzer | `/dashboard/files` | ارفع PDF/TXT/CSV واسأل عنه |
| Code Assistant | `/dashboard/code` | الصق كودًا واختر إجراءً (شرح/إصلاح/تحسين...) |

للتأكد من عمل حدود الاستخدام: كرّر استدعاء أداة حتى تتجاوز الحد اليومي، يجب أن تظهر رسالة
"لقد وصلت إلى الحد المجاني اليوم. حاول مرة أخرى غدًا."

## 10. المزايا المنفذة في هذه النسخة

- تسجيل/دخول/خروج وإعادة تعيين كلمة المرور عبر Supabase Auth
- Dashboard مع Sidebar وبطاقات استخدام يومية
- AI Chat مع محادثات متعددة، تسمية، حذف، Markdown، Streaming، وإعادة توليد
- AI Writer بعدة أنواع محتوى ونبرات وأطوال
- Summarizer (نص/PDF/TXT) بثلاثة مستويات تلخيص
- Translator بين 9 لغات مع خاصية التبديل
- Image Generator بأنماط ونسب أبعاد مختلفة
- Speech to Text لملفات صوتية
- File Analyzer لأسئلة تفاعلية حول محتوى الملفات
- Code Assistant (شرح/إصلاح/تحسين/توليد/تحويل لغة)
- نظام حدود استخدام يومي مُطبَّق بالكامل من جانب الخادم
- Row Level Security على كل الجداول بحيث لا يصل مستخدم لبيانات غيره
- لوحة إدارة `/admin` محمية بتحقق صلاحيات حقيقي من الخادم
- صفحات About / Pricing / Contact / Privacy / Terms / FAQ
- Sitemap وRobots.txt وOpen Graph وTwitter Cards
- تصميم RTL عربي كامل، Dark Mode افتراضي، متجاوب بالكامل

## 11. خدمات تحتاج مفتاح API

| الخدمة | مطلوبة لـ | مجانية أم مدفوعة |
|---|---|---|
| Supabase | المصادقة، قاعدة البيانات، التخزين | Free Tier سخي، مدفوع عند التوسع |
| OpenAI API | AI Chat, Writer, Summarizer, Translator, File Analyzer, Code Assistant, Image Generator, Speech to Text | مدفوعة حسب الاستخدام (Pay-as-you-go)، لا توجد خطة مجانية دائمة |
| Vercel | الاستضافة | Free Tier كافٍ للبدء |

## 12. بنية المشروع

```
app/                  Next.js App Router (صفحات + API routes)
  (auth)/             صفحات تسجيل الدخول/إنشاء حساب/استعادة كلمة المرور
  dashboard/           صفحات لوحة المستخدم وكل الأدوات
  admin/                لوحة الإدارة
  api/                  Route Handlers لكل أداة
components/            مكوّنات واجهة قابلة لإعادة الاستخدام
lib/
  supabase/             عملاء Supabase (متصفح/خادم/middleware)
  ai/                   طبقة مزوّد الذكاء الاصطناعي القابلة للتبديل
  usage.ts              منطق حدود الاستخدام اليومية (خادم فقط)
types/                 أنواع TypeScript المشتركة
supabase/migrations/   ملفات SQL لإنشاء قاعدة البيانات
```

## ملاحظة أمنية

جميع نقاط الوصول (`/api/*`) تتحقق من الهوية عبر جلسة Supabase قبل تنفيذ أي طلب، وتتحقق من حد
الاستخدام اليومي من قاعدة البيانات مباشرة (وليس من بيانات يرسلها المتصفح)، وتتحقق من صحة
المدخلات عبر Zod قبل استدعاء أي مزود خارجي.
