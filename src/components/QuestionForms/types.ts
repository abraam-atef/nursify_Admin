/**
 * Every specialized question form shares this contract. AddQuestion.tsx
 * (the orchestrator) owns the actual state; each form only renders the
 * fields relevant to its question type and reports edits back up.
 */
export interface QuestionFormProps {
  text: string;
  onTextChange: (value: string) => void;
  textError?: string;
  answers: string[];
  onAnswersChange: (value: string[]) => void;
  answersError?: string;
  choices: string[];
  onChoicesChange: (value: string[]) => void;
  choicesError?: string;
}
