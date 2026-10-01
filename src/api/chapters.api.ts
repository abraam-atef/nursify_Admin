import { api } from "@/api/axios";
import { Chapter, CreateChapterPayload } from "@/types/chapter";

export const chaptersApi = {
  listBySubject(subjectId: number) {
    return api.get<Chapter[]>(`/chapter/${subjectId}`).then((res) => res.data);
  },
  create(payload: CreateChapterPayload) {
    return api
      .post<Chapter>(`/chapter/chapter/admin`, { name: payload.name, subject: payload.subject })
      .then((res) => res.data);
  },
  remove(chapterId: number) {
    return api.delete(`/chapter/chapter/admin/${chapterId}`).then((res) => res.data);
  },
};
