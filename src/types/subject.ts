export interface Subject {
  id: number;
  name: string;
  image: string;
}

export interface CreateSubjectPayload {
  name: string;
  image: string;
}
