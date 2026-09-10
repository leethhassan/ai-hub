import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PricingCard } from "@/components/PricingCard";

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-5 py-16">
        <h1 className="text-3xl font-bold mb-2 text-center">خطط بسيطة تناسب الجميع</h1>
        <p className="text-ink-muted text-center mb-12">ابدأ مجانًا، وترقّى لاحقًا عند الحاجة لمزيد من الاستخدام.</p>
        <div className="grid sm:grid-cols-3 gap-5">
          <PricingCard
            name="Free"
            price="0 $"
            description="للتجربة والاستخدام اليومي الخفيف."
            features={["20 رسالة محادثة يوميًا", "5 عمليات كتابة يوميًا", "5 ترجمات يوميًا", "عمليتا تحليل ملفات يوميًا"]}
          />
          <PricingCard
            name="Pro"
            price="قريبًا"
            description="لاستخدام أوسع وحدود أعلى."
            features={["حدود استخدام موسّعة", "أولوية في المعالجة", "دعم فني أسرع"]}
            highlighted
          />
          <PricingCard
            name="Business"
            price="قريبًا"
            description="للفرق والشركات."
            features={["مقاعد متعددة", "تقارير استخدام", "دعم مخصص"]}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
