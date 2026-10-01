import { Textarea } from "@/components/Textarea";
import { Input } from "@/components/Input";
import { QuestionFormProps } from "./types";

export function DefinitionForm({ text, onTextChange, textError, answers, onAnswersChange, answersError }: QuestionFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <Textarea
        label="Question"
        placeholder="e.g. What is anatomy?"
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        error={textError}
      />
      <Input
        label="Answer"
        placeholder="e.g. The study of body structure"
        value={answers[0] ?? ""}
        onChange={(e) => onAnswersChange([e.target.value])}
        error={answersError}
      />
    </div>
  );
}
