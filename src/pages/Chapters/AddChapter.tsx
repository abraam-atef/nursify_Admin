import { FormEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { chaptersApi } from "@/api/chapters.api";
import { extractErrorMessage } from "@/api/axios";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { useToast } from "@/context/ToastContext";

export function AddChapter() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const { show } = useToast();
  const id = Number(subjectId);

  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Chapter name is required.");
      return;
    }
    setIsSubmitting(true);
    try {
      await chaptersApi.create({ name: name.trim(), subject: id });
      show("Chapter created.", "success");
      navigate(`/subjects/${id}/chapters`);
    } catch (err) {
      show(extractErrorMessage(err, "Couldn't create the chapter."), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <button
          onClick={() => navigate(`/subjects/${id}/chapters`)}
          className="mb-3 flex items-center gap-1.5 text-sm text-ink-light hover:text-ink dark:text-white/50 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Chapters
        </button>
        <h1 className="text-xl font-semibold">Add Chapter</h1>
        <p className="text-sm text-ink-light dark:text-white/50">Under Subject #{id}</p>
      </div>

      <Card className="max-w-lg">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <Input
            label="Chapter name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError("");
            }}
            error={error}
            placeholder="e.g. The Cardiovascular System"
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => navigate(`/subjects/${id}/chapters`)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Create Chapter
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
