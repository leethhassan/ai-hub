import type { Metadata } from "next";
import { Tajawal, Cairo } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-tajawal"
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cairo"
});

export const metadata: Metadata = {
  title: "AI Hub — كل أدوات الذكاء الاصطناعي في مكان واحد",
  description:
    "اكتب، حلل، ترجم، لخّص، أنشئ الصور وتحدث مع الذكاء الاصطناعي من منصة عربية واحدة.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "AI Hub",
    description: "كل أدوات الذكاء الاصطناعي التي تحتاجها في مكان واحد",
    locale: "ar_IQ",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Hub",
    description: "كل أدوات الذكاء الاصطناعي التي تحتاجها في مكان واحد"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`dark ${tajawal.variable} ${cairo.variable}`}>
      <body className="font-sans antialiased bg-bg text-ink min-h-screen">{children}</body>
    </html>
  );
}
