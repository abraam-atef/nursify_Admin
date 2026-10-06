import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { questionsApi } from "@/api/questions.api";
import { extractErrorMessage } from "@/api/axios";
import { CreateQuestionPayload, QUESTION_TYPES, QuestionType } from "@/types/question";
import { Select } from "@/components/Select";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { useToast } from "@/context/ToastContext";

import { DefinitionForm } from "@/components/QuestionForms/DefinitionForm";
import { CompleteForm } from "@/components/QuestionForms/CompleteForm";
import { TrueFalseForm } from "@/components/QuestionForms/TrueFalseForm";
import { ChooseForm } from "@/components/QuestionForms/ChooseForm";
import { ListForm } from "@/components/QuestionForms/ListForm";
import { EnumerateForm } from "@/components/QuestionForms/EnumerateForm";
import { ShortNoteForm } from "@/components/QuestionForms/ShortNoteForm";
import { SituationForm } from "@/components/QuestionForms/SituationForm";
import { QuestionFormProps } from "@/components/QuestionForms/types";

const FORM_BY_TYPE: Record<QuestionType, (props: QuestionFormProps) => JSX.Element> = {
  definition: DefinitionForm,
  complete: CompleteForm,
  true_false: TrueFalseForm,
  choose: ChooseForm,
  list: ListForm,
  enumerate: EnumerateForm,
  short_notes: ShortNoteForm,
  situation: SituationForm,
};

interface FieldErrors {
  type?: string;
  text?: string;
  answers?: string;
  choices?: string;
}

function trimmedNonEmpty(values: string[]): string[] {
  return values.map((v) => v.trim()).filter((v) => v.length > 0);
}

/**
 * Validates and shapes the form state into the exact API contract per
 * question type before submit. This is the one place that knows the
 * per-type rules from the PRD's validation section, so every form stays
 * a plain, dumb field-renderer.
 */
function buildPayload(
  type: QuestionType,
  text: string,
  answers: string[],
  choices: string[]
): { payload: Omit<CreateQuestionPayload, "chapter"> | null; errors: FieldErrors } {
  const trimmedText = text.trim();
  const errors: FieldErrors = {};
  if (!trimmedText) errors.text = "Question text is required.";

  switch (type) {
    case "definition":
    case "complete": {
      const answer = (answers[0] ?? "").trim();
      if (!answer) errors.answers = "An answer is required.";
      if (Object.keys(errors).length) return { payload: null, errors };
      return { payload: { type, text: trimmedText, answers: [answer], choices: null }, errors };
    }
    case "list":
    case "enumerate":
    case "short_notes":
    case "situation": {
      const cleaned = trimmedNonEmpty(answers);
      if (cleaned.length === 0) errors.answers = "At least one answer is required.";
      if (Object.keys(errors).length) return { payload: null, errors };
      return { payload: { type, text: trimmedText, answers: cleaned, choices: null }, errors };
    }
    case "true_false": {
      const answer = answers[0];
      if (answer !== "True" && answer !== "False") errors.answers = "Select True or False.";
      if (Object.keys(errors).length) return { payload: null, errors };
      return { payload: { type, text: trimmedText, answers: [answer], choices: ["True", "False"] }, errors };
    }
    case "choose": {
      const cleanedChoices = choices.map((c) => c.trim());
      const filled = cleanedChoices.filter((c) => c.length > 0);
      if (filled.length < 4) errors.choices = "All four choices are required.";
      const correct = (answers[0] ?? "").trim();
      if (!correct) errors.answers = "Select the correct choice.";
      else if (!cleanedChoices.includes(correct)) errors.answers = "The correct answer must match one of the choices.";
      if (Object.keys(errors).length) return { payload: null, errors };
      return { payload: { type, text: trimmedText, answers: [correct], choices: cleanedChoices }, errors };
    }
  }
}

export function AddQuestion() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();
  const { show } = useToast();
  const id = Number(chapterId);

  const [type, setType] = useState<QuestionType | "">("");
  const [text, setText] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [choices, setChoices] = useState<string[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitting2, setIsSubmitting2] = useState(false);

  const ActiveForm = type ? FORM_BY_TYPE[type] : null;

  const typeOptions = useMemo(
    () => QUESTION_TYPES.map((t) => ({ value: t.value, label: t.label })),
    []
  );

  const resetTypeSpecificState = () => {
    setText("");
    setAnswers([]);
    setChoices([]);
    setErrors({});
  };

  const handleSubmit = async (ButtonType: string) => {

    if (!type) {
      setErrors({ type: "Select a question type first." });
      return;
    }

    const { payload, errors: validationErrors } = buildPayload(type, text, answers, choices);
    setErrors(validationErrors);
    if (!payload) return;

    ButtonType === "create" ? setIsSubmitting(true) : setIsSubmitting2(true);
    try {
      await questionsApi.create({ ...payload, chapter: id });
      show("Question created.", "success");
      ButtonType === "create" ? navigate(`/chapters/${id}/questions`) : setType("");
    } catch (err) {
      show(extractErrorMessage(err, "Couldn't create the question."), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <button
          onClick={() => navigate(`/chapters/${id}/questions`)}
          className="mb-3 flex items-center gap-1.5 text-sm text-ink-light hover:text-ink dark:text-white/50 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Questions
        </button>
        <h1 className="text-xl font-semibold">Add Question</h1>
        <p className="text-sm text-ink-light dark:text-white/50">Under Chapter #{id}</p>
      </div>

      <Card className="max-w-xl">
        <div className="flex flex-col gap-5">
          <Select
            label="Question type"
            placeholder="Select a question type…"
            options={typeOptions}
            value={type}
            error={errors.type}
            onChange={(e) => {
              setType(e.target.value as QuestionType);
              resetTypeSpecificState();
            }}
          />

          {ActiveForm && (
            <div className="border-t border-border pt-4 dark:border-border-dark">
              <ActiveForm
                text={text}
                onTextChange={setText}
                textError={errors.text}
                answers={answers}
                onAnswersChange={setAnswers}
                answersError={errors.answers}
                choices={choices}
                onChoicesChange={setChoices}
                choicesError={errors.choices}
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" onClick={() => navigate(`/chapters/${id}/questions`)}>
              Cancel
            </Button>
            <Button onClick={() => handleSubmit("create")} isLoading={isSubmitting} disabled={!type}>
              Create Question
            </Button>
            <Button onClick={() => handleSubmit("AddAnother")} isLoading={isSubmitting2} disabled={!type}>
              Save And Add Another
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
