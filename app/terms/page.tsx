import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-5 py-16 prose-chat text-ink-muted leading-relaxed">
        <h1 className="text-3xl font-bold text-ink mb-6">الشروط والأحكام</h1>
        <p className="mb-4">باستخدامك منصة AI Hub فإنك توافق على الشروط التالية.</p>
        <h2 className="text-lg font-medium text-ink mt-6 mb-2">الاستخدام المسموح</h2>
        <p className="mb-4">يُمنع استخدام المنصة لإنشاء محتوى مسيء أو غير قانوني أو ينتهك حقوق الآخرين.</p>
        <h2 className="text-lg font-medium text-ink mt-6 mb-2">حدود الاستخدام</h2>
        <p className="mb-4">تخضع الخطة المجانية لحدود استخدام يومية قد تتغير دون إشعار مسبق.</p>
        <h2 className="text-lg font-medium text-ink mt-6 mb-2">إخلاء مسؤولية</h2>
        <p>نتائج أدوات الذكاء الاصطناعي قد تحتوي على أخطاء؛ يتحمل المستخدم مسؤولية التحقق من المحتوى قبل استخدامه.</p>
      </div>
      <Footer />
    </>
  );
}
