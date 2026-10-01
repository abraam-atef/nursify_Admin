import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

interface DynamicAnswerListProps {
  values: string[];
  onChange: (values: string[]) => void;
  error?: string;
  itemLabel?: string;
}

/**
 * Add/remove list of plain-text answer inputs, used by List, Enumerate,
 * Short Note and Situation. Always keeps at least one row on screen; the
 * empty-row-stripping happens on submit in AddQuestion, not here.
 */
export function DynamicAnswerList({ values, onChange, error, itemLabel = "Answer" }: DynamicAnswerListProps) {
  const rows = values.length > 0 ? values : [""];

  const updateAt = (index: number, value: string) => {
    const next = [...rows];
    next[index] = value;
    onChange(next);
  };

  const removeAt = (index: number) => {
    const next = rows.filter((_, i) => i !== index);
    onChange(next.length > 0 ? next : [""]);
  };

  const addRow = () => onChange([...rows, ""]);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-ink dark:text-white/90">Answers</span>
      <div className="flex flex-col gap-2">
        {rows.map((val, i) => (
          <div key={i} className="flex items-end gap-2">
            <div className="flex-1">
              <Input
                label={`${itemLabel} ${i + 1}`}
                value={val}
                onChange={(e) => updateAt(i, e.target.value)}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => removeAt(i)}
              disabled={rows.length === 1}
              aria-label={`Remove ${itemLabel.toLowerCase()} ${i + 1}`}
              className="mb-0.5 shrink-0 px-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="secondary" onClick={addRow} className="w-fit">
        <Plus className="h-4 w-4" />
        Add answer
      </Button>
      {error && <p className="text-xs text-pulse-500">{error}</p>}
    </div>
  );
}
