import { api } from "@/api/axios";
import { CreateSubjectPayload, Subject } from "@/types/subject";

export const subjectsApi = {
  list() {
    return api.get<Subject[]>("/subject/").then((res) => res.data);
  },
  create(payload: CreateSubjectPayload) {
    return api.post<Subject>("/subject/admin", payload).then((res) => res.data);
  },
  remove(id: number) {
    return api.delete(`/subject/admin/${id}`).then((res) => res.data);
  },
};
