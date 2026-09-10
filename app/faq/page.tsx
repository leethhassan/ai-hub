import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowLeft } from "lucide-react";

const faqs = [
  { q: "هل المنصة مجانية؟", a: "نعم، يمكنك استخدام جميع الأدوات ضمن حدود استخدام يومية مجانية بالكامل." },
  { q: "هل بياناتي آمنة؟", a: "كل محادثاتك وملفاتك مرتبطة بحسابك فقط ومحمية عبر قواعد أمان صارمة على مستوى قاعدة البيانات." },
  { q: "هل يمكنني استخدام المنصة من الهاتف؟", a: "نعم، المنصة متجاوبة بالكامل وتعمل على الهاتف والتابلت والكمبيوتر." },
  { q: "متى تتوفر الخطط المدفوعة؟", a: "نعمل على إطلاق خطط Pro وBusiness قريبًا لمزيد من الاستخدام والمزايا." },
  { q: "ماذا يحدث عند وصولي للحد اليومي؟", a: "ستظهر رسالة توضح أنك وصلت إلى الحد المجاني، ويمكنك المتابعة في اليوم التالي." }
];

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-5 py-16">
        <h1 className="text-3xl font-bold mb-8">الأسئلة الشائعة</h1>
        <div className="flex flex-col divide-y divide-border">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex items-center justify-between cursor-pointer list-none font-medium">
                {f.q}
                <ArrowLeft className="h-4 w-4 text-ink-muted transition-transform group-open:-rotate-90" />
              </summary>
              <p className="text-sm text-ink-muted mt-3 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
