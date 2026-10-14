import { DynamicAnswerList } from "./DynamicAnswerList";
import { QuestionFormProps } from "./types";
import { Input } from "../Input";

export function ShortNoteForm({ text, onTextChange, textError, answers, onAnswersChange, answersError }: QuestionFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Question"
        placeholder="e.g. Write a short note about adolescence."
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        error={textError}
      />
      <DynamicAnswerList values={answers} onChange={onAnswersChange} error={answersError} itemLabel="Point" />
    </div>
  );
}
