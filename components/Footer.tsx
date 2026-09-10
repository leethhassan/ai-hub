import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/60 mt-24">
      <div className="mx-auto max-w-6xl px-5 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div className="col-span-2 md:col-span-1">
          <p className="font-bold mb-2">AI Hub</p>
          <p className="text-ink-muted leading-relaxed">
            منصة عربية تجمع أدوات الذكاء الاصطناعي في مكان واحد.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-ink-muted mb-1">المنصة</p>
          <Link href="/#tools" className="text-ink-muted hover:text-ink">الأدوات</Link>
          <Link href="/#pricing" className="text-ink-muted hover:text-ink">الأسعار</Link>
          <Link href="/about" className="text-ink-muted hover:text-ink">من نحن</Link>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-ink-muted mb-1">الدعم</p>
          <Link href="/contact" className="text-ink-muted hover:text-ink">تواصل معنا</Link>
          <Link href="/faq" className="text-ink-muted hover:text-ink">الأسئلة الشائعة</Link>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-ink-muted mb-1">قانوني</p>
          <Link href="/privacy" className="text-ink-muted hover:text-ink">سياسة الخصوصية</Link>
          <Link href="/terms" className="text-ink-muted hover:text-ink">الشروط والأحكام</Link>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-ink-muted">
        © {new Date().getFullYear()} AI Hub. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
