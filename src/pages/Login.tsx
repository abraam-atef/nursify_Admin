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
          autoComplete="username"
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
      </form>
    </Card>
  );
}
