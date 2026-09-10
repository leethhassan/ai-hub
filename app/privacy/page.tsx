import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-5 py-16 prose-chat text-ink-muted leading-relaxed">
        <h1 className="text-3xl font-bold text-ink mb-6">سياسة الخصوصية</h1>
        <p className="mb-4">نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية عند استخدامك لمنصة AI Hub.</p>
        <h2 className="text-lg font-medium text-ink mt-6 mb-2">البيانات التي نجمعها</h2>
        <p className="mb-4">الاسم، البريد الإلكتروني، والمحتوى الذي تنشئه عبر أدوات المنصة، لتقديم الخدمة وتحسينها فقط.</p>
        <h2 className="text-lg font-medium text-ink mt-6 mb-2">حماية البيانات</h2>
        <p className="mb-4">تُخزَّن بياناتك بشكل آمن ولا يمكن لأي مستخدم آخر الوصول إلى محادثاتك أو ملفاتك.</p>
        <h2 className="text-lg font-medium text-ink mt-6 mb-2">التواصل</h2>
        <p>لأي استفسار بخصوص خصوصيتك، يمكنك التواصل معنا عبر صفحة "تواصل معنا".</p>
      </div>
      <Footer />
    </>
  );
}
