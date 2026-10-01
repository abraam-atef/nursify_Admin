import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, HelpCircle, Plus, Trash2 } from "lucide-react";
import { questionsApi } from "@/api/questions.api";
import { extractErrorMessage } from "@/api/axios";
import { Question, QUESTION_TYPES } from "@/types/question";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { SkeletonList } from "@/components/Loading";
import { EmptyState } from "@/components/EmptyState";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useToast } from "@/context/ToastContext";
import { Input } from "@/components/Input";

function typeLabel(type: Question["type"]): string {
  return QUESTION_TYPES.find((t) => t.value === type)?.label ?? type;
}

export function Questions() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();
  const { show } = useToast();
  const id = Number(chapterId);
  const [filter, setFilter] = useState("")

  const [questions, setQuestions] = useState<Question[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Question | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchQuestions = async () => {
    setStatus("loading");
    try {
      const data = await questionsApi.listByChapter(id);
      setQuestions(data);
      setStatus("ready");
    } catch (err) {
      setErrorMessage(extractErrorMessage(err, "Couldn't load questions."));
      setStatus("error");
    }
  };

  useEffect(() => {
    if (Number.isFinite(id)) fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    try {
      await questionsApi.remove(pendingDelete.id);
      setQuestions((prev) => prev.filter((q) => q.id !== pendingDelete.id));
      show("Question deleted.", "success");
      setPendingDelete(null);
    } catch (err) {
      show(extractErrorMessage(err, "Couldn't delete this question."), "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="mb-3 flex items-center gap-1.5 text-sm text-ink-light hover:text-ink dark:text-white/50 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Chapters
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Questions</h1>
            <p className="text-sm text-ink-light dark:text-white/50">Chapter #{id}</p>
          </div>

          <Link to={`/chapters/${id}/questions/add`}>
            <Button>
              <Plus className="h-4 w-4" />
              Add Question
            </Button>
          </Link>
        </div>
      </div>

      {status === "loading" && <SkeletonList count={3} />}

      {status === "error" && (
        <EmptyState
          icon={<HelpCircle className="h-8 w-8" />}
          title="Couldn't load questions"
          description={errorMessage}
          action={<Button onClick={fetchQuestions}>Retry</Button>}
        />
      )}

      {status === "ready" && questions.length === 0 && (
        <EmptyState
          icon={<HelpCircle className="h-8 w-8" />}
          title="No questions yet"
          description="Add the first question for this chapter."
          action={
            <Link to={`/chapters/${id}/questions/add`}>
              <Button>
                <Plus className="h-4 w-4" />
                Add Question
              </Button>
            </Link>
          }
        />
      )}

      {status === "ready" && questions.length > 0 && (
        <div className="flex flex-col gap-3">
          <Input
            label="Search Quistion"
            placeholder="e.g. The study of body structure"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          {questions.filter((f) => {
            return filter.toLowerCase() === "" ? f : f.text.toLowerCase().includes(filter)
          }).map((q) => (
            <Card key={q.id} className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <span className="w-fit rounded-full bg-clinical-50 px-2 py-0.5 text-xs font-medium text-clinical-600 dark:bg-clinical-900/40 dark:text-clinical-300">
                    {typeLabel(q.type)}
                  </span>
                  <p className="text-sm font-medium text-ink dark:text-white">{q.text}</p>
                </div>
                <button
                  onClick={() => setPendingDelete(q)}
                  aria-label="Delete question"
                  className="shrink-0 rounded-card p-1.5 text-ink-light hover:bg-pulse-50 hover:text-pulse-500 dark:text-white/40 dark:hover:bg-pulse-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {q.choices && q.choices.length > 0 && (
                <p className="text-xs text-ink-light dark:text-white/40">
                  Choices: {q.choices.join(", ")}
                </p>
              )}
              {q.answers && q.answers.length > 0 && (
                <p className="text-xs text-ink-light dark:text-white/40">
                  Answer{q.answers.length > 1 ? "s" : ""}: {q.answers.join(", ")}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(pendingDelete)}
        title="Delete question"
        description="This question will be permanently removed. This can't be undone."
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
