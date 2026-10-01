import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { subjectsApi } from "@/api/subjects.api";
import { extractErrorMessage } from "@/api/axios";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { useToast } from "@/context/ToastContext";

interface FormState {
  name: string;
  image: string;
}

export function AddSubject() {
  const navigate = useNavigate();
  const { show } = useToast();
  const [form, setForm] = useState<FormState>({ name: "", image: "" });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const next: Partial<FormState> = {};
    if (!form.name.trim()) next.name = "Subject name is required.";
    if (!form.image.trim()) next.image = "An image URL is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await subjectsApi.create({ name: form.name.trim(), image: form.image.trim() });
      show("Subject created.", "success");
      navigate("/subjects");
    } catch (err) {
      show(extractErrorMessage(err, "Couldn't create the subject."), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <button
          onClick={() => navigate("/subjects")}
          className="mb-3 flex items-center gap-1.5 text-sm text-ink-light hover:text-ink dark:text-white/50 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Subjects
        </button>
        <h1 className="text-xl font-semibold">Add Subject</h1>
      </div>

      <Card className="max-w-lg">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <Input
            label="Subject name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            error={errors.name}
            placeholder="e.g. Anatomy & Physiology"
          />
          <Input
            label="Image URL"
            value={form.image}
            onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
            error={errors.image}
            placeholder="https://…"
            hint="Shown as the subject's card image."
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => navigate("/subjects")}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Create Subject
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
