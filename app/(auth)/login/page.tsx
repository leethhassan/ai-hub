import { Suspense } from 'react';
import LoginForm from '@/components/auth/LoginForm'; // أو استبدل المسار بمكون تسجيل الدخول لديك

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">جاري التحميل...</div>}>
      <LoginForm />
    </Suspense>
  );
}
