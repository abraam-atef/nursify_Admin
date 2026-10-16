import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { useAuth } from "@/hooks/useAuth";
import { extractErrorMessage } from "@/api/axios";

interface FormState {
  username: string;
  password: string;
}

interface FormErrors {
  username?: string;
  password?: string;
}

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? "/subjects";

  const [form, setForm] = useState<FormState>({ username: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!form.username.trim()) next.username = "userName is required.";
    if (!form.password) next.password = "Password is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const GOOGLE_CLIENT_ID = '157586642046-4biv2r59ojuf7ldo8lfrmrsolc1dj2ok.apps.googleusercontent.com';
  const REDIRECT_URI = 'https://nursify-admin-alqw.vercel.app/auth/google/callback';


  const handleLogin = () => {
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'openid email profile');
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');

    window.location.href = authUrl.toString();
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setApiError(extractErrorMessage(err, "Invalid username or password."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-semibold text-ink dark:text-white">Sign in</h2>
          <p className="text-sm text-ink-light dark:text-white/50">
            Manage subjects, chapters and questions.
          </p>
        </div>

        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
            className="flex items-start gap-2 rounded-card border border-pulse-200 bg-pulse-50 px-3 py-2 text-sm text-pulse-700 dark:border-pulse-700/40 dark:bg-pulse-900/20 dark:text-pulse-200"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{apiError}</span>
          </motion.div>
        )}

        <Input
          label="name"
          type="text"
          autoComplete="additional-name"
          value={form.username}
          onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
          error={errors.username}
          placeholder="admin"
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          error={errors.password}
          placeholder="••••••••"
        />

        <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
        <hr />
        <div className="mt-6 mb-4 w-full flex flex-row justify-center">
          <button onClick={handleLogin} type="button" className="m-3 shadow-lg shadow-emerald-300 btn btn-ghost inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-gray-900 border-2 border-1 border-emerald-300 bg-gray-50 sm:mt-0 sm:w-auto"><svg aria-label="Google icon" className="amplify-icon w-5 h-5 mr-2" viewBox="0 0 256 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"></path><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"></path><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"></path><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"></path></svg> Sign in with Google </button>
        </div>
      </form>
    </Card>
  );
}
