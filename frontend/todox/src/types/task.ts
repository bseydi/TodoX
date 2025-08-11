// frontend/src/types.ts
/** Types partagés pour assurer la cohérence entre composants. */
export type TaskId = number;

export interface Task {
  id?: TaskId;
  title: string;
  description: string;
  completed: boolean;
  updatedAt: number;
}

/** Utilisé par le formulaire; l'id est généré côté Home. */
export interface TaskInput {
  title: string;
  description: string;
}

/** Patch partiel autorisé pour l'édition inline. */
export type TaskPatch = Partial<Pick<Task, "title" | "description" | "completed">>;