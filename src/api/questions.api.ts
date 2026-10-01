import { api } from "@/api/axios";
import { CreateQuestionPayload, Question } from "@/types/question";

export const questionsApi = {
  listByChapter(chapterId: number) {
    return api.get<Question[]>(`/quistions/chapter/${chapterId}`).then((res) => res.data);
  },
  create(payload: CreateQuestionPayload) {
    return api.post<Question>(`/quistions/admin`, {
      text: payload.text,
      type: payload.type,
      answers: payload.answers,
      choices: payload.choices,
      chapter: payload.chapter
    }).then((res) => res.data);
  },
  remove(questionId: number) {
    return api.delete(`/quistions/admin/${questionId}`).then((res) => res.data);
  },
};
