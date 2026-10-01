import { Textarea } from "@/components/Textarea";
import { QuestionFormProps } from "./types";

const SLOT_COUNT = 4;

/**
 * Exactly four choice inputs. The radio next to each choice marks it as
 * correct; selecting a radio copies that choice's *current text* into
 * answers, so the payload always carries the exact string, never an index.
 */
export function ChooseForm({
  text,
  onTextChange,
  textError,
  answers,
  onAnswersChange,
  answersError,
  choices,
  onChoicesChange,
  choicesError,
}: QuestionFormProps) {
  const slots = Array.from({ length: SLOT_COUNT }, (_, i) => choices[i] ?? "");
  const correctIndex = answers[0] !== undefined ? slots.indexOf(answers[0]) : -1;

  const updateChoice = (index: number, value: string) => {
    const next = [...slots];
    const wasCorrect = index === correctIndex;
    next[index] = value;
    onChoicesChange(next);
    if (wasCorrect) onAnswersChange([value]);
  };

  const selectCorrect = (index: number) => {
    onAnswersChange([slots[index]]);
  };

  return (
    <div className="flex flex-col gap-4">
      <Textarea
        label="Question"
        placeholder="e.g. Which organ pumps blood?"
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        error={textError}
      />

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink dark:text-white/90">
          Choices — select the correct one
        </span>
        <div className="flex flex-col gap-2">
          {slots.map((val, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 rounded-card border px-3 py-1.5 transition-colors ${
                i === correctIndex
                  ? "border-clinical-400 bg-clinical-50 dark:border-clinical-500 dark:bg-clinical-900/30"
                  : "border-border dark:border-border-dark"
              }`}
            >
              <input
                type="radio"
                name="choose-correct"
                aria-label={`Mark choice ${i + 1} as correct`}
                checked={i === correctIndex}
                onChange={() => selectCorrect(i)}
                disabled={!val.trim()}
                className="h-4 w-4 shrink-0 accent-clinical-500"
              />
              <input
                type="text"
                aria-label={`Choice ${i + 1}`}
                placeholder={`Choice ${i + 1}`}
                value={val}
                onChange={(e) => updateChoice(i, e.target.value)}
                className="w-full bg-transparent py-1 text-sm text-ink outline-none placeholder:text-ink-light/60 dark:text-white"
              />
            </div>
          ))}
        </div>
        {choicesError && <p className="text-xs text-pulse-500">{choicesError}</p>}
        {answersError && <p className="text-xs text-pulse-500">{answersError}</p>}
      </div>
    </div>
  );
}
