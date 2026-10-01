import { useEffect } from "react";
import { Textarea } from "@/components/Textarea";
import { RadioGroup } from "@/components/RadioGroup";
import { QuestionFormProps } from "./types";

const OPTIONS = [
  { value: "True", label: "True" },
  { value: "False", label: "False" },
];

export function TrueFalseForm({
  text,
  onTextChange,
  textError,
  answers,
  onAnswersChange,
  answersError,
  onChoicesChange,
}: QuestionFormProps) {
  // Choices are fixed for this type; set them once so the payload always
  // carries ["True", "False"] regardless of what the admin selects.
  useEffect(() => {
    onChoicesChange(["True", "False"]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <Textarea
        label="Statement"
        placeholder="e.g. The heart has four chambers."
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        error={textError}
      />
      <RadioGroup
        name="true-false"
        legend="Correct answer"
        options={OPTIONS}
        value={answers[0] ?? null}
        onChange={(value) => onAnswersChange([value])}
        error={answersError}
      />
    </div>
  );
}
