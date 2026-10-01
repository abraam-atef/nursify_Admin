export interface Chapter {
  id: number;
  name: string;
  subjectId?: number;
}

export interface CreateChapterPayload {
  name: string;
  subject: number;
}
