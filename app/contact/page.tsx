"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <Navbar />
      <div className="max-w-lg mx-auto px-5 py-16">
        <h1 className="text-3xl font-bold mb-2">تواصل معنا</h1>
        <p className="text-ink-muted mb-8">لديك سؤال أو اقتراح؟ راسلنا وسنرد في أقرب وقت.</p>

        {sent ? (
          <p className="text-accent-glow">تم إرسال رسالتك بنجاح. شكرًا لتواصلك معنا.</p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="flex flex-col gap-4"
          >
            <Input required placeholder="الاسم" />
            <Input required type="email" placeholder="البريد الإلكتروني" />
            <Textarea required rows={5} placeholder="رسالتك" />
            <Button type="submit" className="w-fit">إرسال</Button>
          </form>
        )}
      </div>
      <Footer />
    </>
  );
}
