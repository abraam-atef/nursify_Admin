import { useState, useEffect, useRef } from 'react';
import { isAxiosError } from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';

export function GoogleCallbackHandler({ onError }: any) {
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { googlelogin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? "/subjects";

    // مرجع لمنع التنفيذ المكرر (حفظ الـ code من الاستهلاك مرتين)
    const isCalled = useRef(false);

    useEffect(() => {
        // إيقاف التنفيذ إذا تم استدعاء الدالة مسبقاً
        if (isCalled.current) return;
        isCalled.current = true;

        const handleGoogleCallback = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const code = params.get('code');
                const errorParam = params.get('error');

                // في حال إلغاء المستخدم للمصادقة
                if (errorParam) {
                    throw new Error(`رفض المستخدم المصادقة: ${errorParam}`);
                }

                if (!code) {
                    throw new Error('لم يتم العثور على كود المصادقة (code) في الرابط');
                }

                // إرسال الـ code لسيرفر الـ Backend باستخدام axios
                await googlelogin({ code });
                navigate(from, { replace: true });
                setLoading(false);

            } catch (err) {
                setLoading(false);
                let message = 'حدث خطأ غير متوقع';
                // التقاط أخطاء Django / Django-Allauth وأخطاء الشبكة
                if (isAxiosError(err)) {
                    // TypeScript الآن يعرف تماماً أن err هو AxiosError
                    message =
                        err.response?.data?.non_field_errors?.[0] ||
                        err.response?.data?.message ||
                        err.message;
                } else if (err instanceof Error) {
                    // أخطاء JavaScript العادية
                    message = err.message;
                }
                setErrorMessage(message);

                if (onError) {
                    onError(err);
                }
            }
        };

        handleGoogleCallback();
    }, []); // مصفوفة فارغة لتضمن التشغيل مرة واحدة فقط عند تحميل المكون

    if (loading) {
        return <div>جاري التحقق وتسجيل الدخول عبر Google...</div>;
    }

    if (errorMessage) {
        return <div style={{ color: 'red' }}>فشل تسجيل الدخول: {errorMessage}</div>;
    }

    return <div>تم تسجيل الدخول بنجاح!</div>;
}