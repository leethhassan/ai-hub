import Link from "next/link";
import {
  MessageSquare,
  PenLine,
  FileText,
  Languages,
  ImageIcon,
  Mic,
  FolderOpen,
  Code2,
  Zap,
  Globe,
  ShieldCheck,
  Gift,
  ArrowLeft
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ToolCard } from "@/components/ToolCard";
import { PricingCard } from "@/components/PricingCard";

const tools = [
  { icon: MessageSquare, name: "AI Chat", description: "تحدث مع الذكاء الاصطناعي واحصل على إجابات فورية لأي سؤال.", href: "/dashboard/chat" },
  { icon: PenLine, name: "AI Writer", description: "اكتب مقالات ومنشورات وإعلانات احترافية خلال ثوانٍ.", href: "/dashboard/writer" },
  { icon: FileText, name: "Summarizer", description: "لخّص النصوص والملفات الطويلة إلى نقاط واضحة.", href: "/dashboard/summarizer" },
  { icon: Languages, name: "Translator", description: "ترجم بين العربية والإنجليزية وعدة لغات أخرى بدقة.", href: "/dashboard/translator" },
  { icon: ImageIcon, name: "Image Generator", description: "حوّل الوصف النصي إلى صورة فنية فريدة.", href: "/dashboard/image-generator" },
  { icon: Mic, name: "Speech to Text", description: "حوّل التسجيلات الصوتية إلى نص مكتوب دقيق.", href: "/dashboard/speech" },
  { icon: FolderOpen, name: "File Analyzer", description: "ارفع ملف PDF أو CSV واسأل الذكاء الاصطناعي عن محتواه.", href: "/dashboard/files" },
  { icon: Code2, name: "Code Assistant", description: "اكتب وصحّح واشرح الأكواد البرمجية بعدة لغات.", href: "/dashboard/code" }
];

const whyUs = [
  { icon: Zap, title: "سرعة عالية", desc: "استجابة فورية لجميع الأدوات دون انتظار." },
  { icon: Globe, title: "واجهة عربية بالكامل", desc: "تصميم RTL مبني خصيصًا للمستخدم العربي." },
  { icon: MessageSquare, title: "أدوات متعددة", desc: "8 أدوات ذكاء اصطناعي في حساب واحد." },
  { icon: ShieldCheck, title: "حماية وخصوصية", desc: "بياناتك ومحادثاتك محمية ولا يصل إليها أحد غيرك." },
  { icon: Gift, title: "استخدام مجاني يوميًا", desc: "ابدأ الآن بدون بطاقة ائتمان." }
];

const faqs = [
  { q: "هل المنصة مجانية؟", a: "نعم، يمكنك استخدام جميع الأدوات ضمن حدود استخدام يومية مجانية بالكامل." },
  { q: "هل بياناتي آمنة؟", a: "كل محادثاتك وملفاتك مرتبطة بحسابك فقط ومحمية عبر قواعد أمان صارمة على مستوى قاعدة البيانات." },
  { q: "هل يمكنني استخدام المنصة من الهاتف؟", a: "نعم، المنصة متجاوبة بالكامل وتعمل على الهاتف والتابلت والكمبيوتر." },
  { q: "متى تتوفر الخطط المدفوعة؟", a: "نعمل على إطلاق خطط Pro وBusiness قريبًا لمزيد من الاستخدام والمزايا." }
];

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, rgba(110,91,255,0.18) 0%, rgba(11,14,20,0) 70%)"
          }}
        />
        <div className="mx-auto max-w-4xl px-5 pt-20 pb-24 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.2] mb-6 text-balance">
            كل أدوات الذكاء الاصطناعي التي تحتاجها في مكان واحد
          </h1>
          <p className="text-ink-muted text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            اكتب، حلل، ترجم، لخّص، أنشئ الصور وتحدث مع الذكاء الاصطناعي من منصة واحدة، مصممة للمستخدم العربي.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="bg-accent hover:bg-accent-soft text-white rounded-xl2 px-7 py-3.5 text-sm font-medium transition-colors w-full sm:w-auto"
            >
              ابدأ مجانًا
            </Link>
            <Link
              href="#tools"
              className="border border-border hover:border-accent/60 rounded-xl2 px-7 py-3.5 text-sm font-medium transition-colors w-full sm:w-auto"
            >
              استكشف الأدوات
            </Link>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="mx-auto max-w-6xl px-5 py-16 scroll-mt-20">
        <div className="mb-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">أدوات جاهزة لكل مهمة</h2>
          <p className="text-ink-muted">ثمانية أدوات ذكاء اصطناعي، بواجهة واحدة بسيطة.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((t) => (
            <ToolCard key={t.name} {...t} />
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold">لماذا AI Hub؟</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {whyUs.map((w) => (
            <div key={w.title} className="text-center flex flex-col items-center gap-3">
              <div className="h-11 w-11 rounded-xl2 bg-accent/10 flex items-center justify-center text-accent-soft">
                <w.icon className="h-5 w-5" />
              </div>
              <p className="font-medium text-sm">{w.title}</p>
              <p className="text-xs text-ink-muted leading-relaxed">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl px-5 py-16 scroll-mt-20">
        <div className="mb-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">خطط بسيطة تناسب الجميع</h2>
          <p className="text-ink-muted">ابدأ مجانًا، وترقّى لاحقًا عند الحاجة لمزيد من الاستخدام.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
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
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-5 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">الأسئلة الشائعة</h2>
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
      </section>

      <Footer />
    </>
  );
}
