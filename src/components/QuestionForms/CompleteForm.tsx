import { Input } from "@/components/Input";
import { QuestionFormProps } from "./types";

export function CompleteForm({ text, onTextChange, textError, answers, onAnswersChange, answersError }: QuestionFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Sentence (use ___ for the blank)"
        placeholder="e.g. The heart has ___ chambers."
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        error={textError}
      />
      <Input
        label="Answer"
        placeholder="e.g. four"
        value={answers[0] ?? ""}
        onChange={(e) => onAnswersChange([e.target.value])}
        error={answersError}
      />
    </div>
  );
}
