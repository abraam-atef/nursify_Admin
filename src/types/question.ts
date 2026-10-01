export type QuestionType =
  | "definition"
  | "complete"
  | "true_false"
  | "choose"
  | "list"
  | "enumerate"
  | "short_notes"
  | "situation";

export interface Question {
  id: number;
  type: QuestionType;
  text: string;
  answers: string[] | null;
  choices: string[] | null;
}

export interface CreateQuestionPayload {
  type: QuestionType;
  text: string;
  answers: string[] | null;
  choices: string[] | null;
  chapter: number;
}

export interface QuestionTypeMeta {
  value: QuestionType;
  label: string;
  description: string;
}

export const QUESTION_TYPES: QuestionTypeMeta[] = [
  { value: "definition", label: "Definition", description: "A term and its definition as the answer." },
  { value: "complete", label: "Complete the sentence", description: "Fill-in-the-blank with one answer." },
  { value: "true_false", label: "True / False", description: "A statement judged true or false." },
  { value: "choose", label: "Choose (multiple choice)", description: "Four choices, one correct answer." },
  { value: "list", label: "List", description: "A question with several short answers." },
  { value: "enumerate", label: "Enumerate", description: "Enumerate multiple items as answers." },
  { value: "short_notes", label: "Short note", description: "A question with several point-form answers." },
  { value: "situation", label: "Situation", description: "A scenario with one or more answers." },
];
