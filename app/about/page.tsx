import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-5 py-16">
        <h1 className="text-3xl font-bold mb-6">من نحن</h1>
        <p className="text-ink-muted leading-relaxed mb-4">
          AI Hub منصة عربية تجمع أدوات الذكاء الاصطناعي الأساسية في مكان واحد: محادثة، كتابة،
          تلخيص، ترجمة، توليد صور، تحويل صوت إلى نص، تحليل ملفات، ومساعد برمجي.
        </p>
        <p className="text-ink-muted leading-relaxed">
          هدفنا تقديم تجربة سريعة وآمنة وموجهة خصيصًا للمستخدم العربي، بواجهة RTL كاملة ودعم للغتين
          العربية والإنجليزية.
        </p>
      </div>
      <Footer />
    </>
  );
}
