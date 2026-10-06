import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ListChecks, Plus, Trash2 ,ClipboardCheckIcon } from "lucide-react";
import { chaptersApi } from "@/api/chapters.api";
import { extractErrorMessage } from "@/api/axios";
import { Chapter } from "@/types/chapter";
import { Button } from "@/components/Button";
import { SkeletonList } from "@/components/Loading";
import { EmptyState } from "@/components/EmptyState";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Table } from "@/components/Table";
import { useToast } from "@/context/ToastContext";

export function Chapters() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const { show } = useToast();
  const id = Number(subjectId);

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Chapter | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchChapters = async () => {
    setStatus("loading");
    try {
      const data = await chaptersApi.listBySubject(id);
      setChapters(data);
      setStatus("ready");
    } catch (err) {
      setErrorMessage(extractErrorMessage(err, "Couldn't load chapters."));
      setStatus("error");
    }
  };

  useEffect(() => {
    if (Number.isFinite(id)) fetchChapters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    try {
      await chaptersApi.remove(pendingDelete.id);
      setChapters((prev) => prev.filter((c) => c.id !== pendingDelete.id));
      show("Chapter deleted.", "success");
      setPendingDelete(null);
    } catch (err) {
      show(extractErrorMessage(err, "Couldn't delete this chapter."), "error");
    } finally {
      setIsDeleting(false);
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Chapters</h1>
            <p className="text-sm text-ink-light dark:text-white/50">Subject #{id}</p>
          </div>
          <Link to={`/subjects/${subjectId}/chapters/add`}>
            <Button>
              <Plus className="h-4 w-4" />
              Add Chapter
            </Button>
          </Link>
        </div>
      </div>

      {status === "loading" && <SkeletonList count={3} />}

      {status === "error" && (
        <EmptyState
          icon={<ListChecks className="h-8 w-8" />}
          title="Couldn't load chapters"
          description={errorMessage}
          action={<Button onClick={fetchChapters}>Retry</Button>}
        />
      )}

      {status === "ready" && chapters.length === 0 && (
        <EmptyState
          icon={<ListChecks className="h-8 w-8" />}
          title="No chapters yet"
          description="Add a chapter to start adding questions."
          action={
            <Link to={`/subjects/${id}/chapters/add`}>
              <Button>
                <Plus className="h-4 w-4" />
                Add Chapter
              </Button>
            </Link>
          }
        />
      )}

      {status === "ready" && chapters.length > 0 && (
        <Table
          columns={[
            { header: "Chapter", render: (c) => <span className="font-medium">{c.name}</span> },
            // { header: "ID", render: (c) => `#${c.id}` },
            {
              header: "Actions",
              className: "text-right",
              render: (c) => (
                <div className="flex justify-end gap-3">
                  <Link
                    to={`/chapters/${c.id}/questions`}
                    className="text-sm font-medium text-clinical-600 hover:underline dark:text-clinical-300"
                  >
                    <button
                    onClick={() => setPendingDelete(c)}
                    aria-label={`Delete ${c.name}`}
                    className="text-ink-light hover:text-pulse-500 dark:text-white/40"
                  >
                    <ClipboardCheckIcon className="h-4 w-4" />
                  </button>
                  </Link>
                  <button
                    onClick={() => setPendingDelete(c)}
                    aria-label={`Delete ${c.name}`}
                    className="text-ink-light hover:text-pulse-500 dark:text-white/40"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ),
            },
          ]}
          rows={chapters}
          getRowKey={(c) => c.id}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(pendingDelete)}
        title="Delete chapter"
        description={`This removes "${pendingDelete?.name}" and its questions. This can't be undone.`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
