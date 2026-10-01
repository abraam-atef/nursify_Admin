import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Plus, Trash2 } from "lucide-react";
import { subjectsApi } from "@/api/subjects.api";
import { extractErrorMessage } from "@/api/axios";
import { Subject } from "@/types/subject";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { SkeletonList } from "@/components/Loading";
import { EmptyState } from "@/components/EmptyState";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useToast } from "@/context/ToastContext";

export function Subjects() {
  const navigate = useNavigate();
  const { show } = useToast();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Subject | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSubjects = async () => {
    setStatus("loading");
    try {
      const data = await subjectsApi.list();
      setSubjects(data);
      setStatus("ready");
    } catch (err) {
      setErrorMessage(extractErrorMessage(err, "Couldn't load subjects."));
      setStatus("error");
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    try {
      await subjectsApi.remove(pendingDelete.id);
      setSubjects((prev) => prev.filter((s) => s.id !== pendingDelete.id));
      show("Subject deleted.", "success");
      setPendingDelete(null);
    } catch (err) {
      show(extractErrorMessage(err, "Couldn't delete this subject."), "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Subjects</h1>
          <p className="text-sm text-ink-light dark:text-white/50">
            Educational subjects available to students.
          </p>
        </div>
        <Link to="/subjects/add">
          <Button>
            <Plus className="h-4 w-4" />
            Add Subject
          </Button>
        </Link>
      </div>

      {status === "loading" && <SkeletonList count={4} />}

      {status === "error" && (
        <EmptyState
          icon={<BookOpen className="h-8 w-8" />}
          title="Couldn't load subjects"
          description={errorMessage}
          action={<Button onClick={fetchSubjects}>Retry</Button>}
        />
      )}

      {status === "ready" && subjects.length === 0 && (
        <EmptyState
          icon={<BookOpen className="h-8 w-8" />}
          title="No subjects yet"
          description="Add your first subject to start building chapters and questions."
          action={
            <Link to="/subjects/add">
              <Button>
                <Plus className="h-4 w-4" />
                Add Subject
              </Button>
            </Link>
          }
        />
      )}

      {status === "ready" && subjects.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject, i) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: i * 0.03 }}
            >
              <Card className="flex flex-col gap-3 p-0 overflow-hidden">
                <button
                  onClick={() => navigate(`/subjects/${subject.id}/chapters`)}
                  className="flex flex-1 flex-col gap-3 p-4 text-left"
                >
                  <div className="flex h-32 items-center justify-center overflow-hidden rounded-card bg-clinical-50 dark:bg-clinical-900/30">
                    {subject.image ? (
                      <img
                        src={subject.image}
                        alt=""
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <BookOpen className="h-8 w-8 text-clinical-300" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-ink dark:text-white">{subject.name}</h3>
                    <p className="text-xs text-ink-light dark:text-white/40">ID #{subject.id}</p>
                  </div>
                </button>
                <div className="flex items-center justify-between border-t border-border px-4 py-2.5 dark:border-border-dark">
                  <Link
                    to={`/subjects/${subject.id}/chapters`}
                    className="text-sm font-medium text-clinical-600 hover:underline dark:text-clinical-300"
                  >
                    View chapters
                  </Link>
                  <button
                    onClick={() => setPendingDelete(subject)}
                    aria-label={`Delete ${subject.name}`}
                    className="rounded-card p-1.5 text-ink-light hover:bg-pulse-50 hover:text-pulse-500 dark:text-white/40 dark:hover:bg-pulse-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(pendingDelete)}
        title="Delete subject"
        description={`This removes "${pendingDelete?.name}" and its chapters. This can't be undone.`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
