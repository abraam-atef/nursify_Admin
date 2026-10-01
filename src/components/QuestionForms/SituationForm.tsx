import { Textarea } from "@/components/Textarea";
import { DynamicAnswerList } from "./DynamicAnswerList";
import { QuestionFormProps } from "./types";

export function SituationForm({ text, onTextChange, textError, answers, onAnswersChange, answersError }: QuestionFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <Textarea
        label="Scenario / question"
        placeholder="Describe the situation, then ask the question…"
        rows={5}
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        error={textError}
      />
      <DynamicAnswerList values={answers} onChange={onAnswersChange} error={answersError} />
    </div>
  );
}
