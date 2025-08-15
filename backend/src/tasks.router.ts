// backend/src/tasks.router.ts
import { Router } from "express";
import type { Request, Response } from "express";
import { db, newId } from "./db.js";
import {
  TaskSchema,
  TaskInputSchema,
  TaskPatchSchema,
  type Task,
  type TaskInput,
  type TaskPatch,
} from "./types.js";

export const tasksRouter = Router();

/** Représentation brute en base (completed = INTEGER) */
type DBRow = {
  id: string;
  title: string;
  description?: string | null;
  completed: number;      // 0/1 en DB
  updatedAt: number;
};

/** Conversion sécurisée DB → domaine (Task) */
function rowToTask(row: DBRow): Task {
  return TaskSchema.parse({
    id: String(row.id),
    title: String(row.title),
    description: String(row.description ?? ""),
    completed: !!row.completed,
    updatedAt: Number(row.updatedAt),
  });
}

/** GET /tasks */
tasksRouter.get("/", (_req: Request, res: Response<Task[]>) => {
  const rows = db.prepare("SELECT * FROM tasks ORDER BY updatedAt DESC").all() as DBRow[];
  res.json(rows.map(rowToTask));
});

/** POST /tasks */
tasksRouter.post<{}, Task, TaskInput>("/", (req, res) => {
  try {
    const input = TaskInputSchema.parse(req.body);
    const now = Date.now();
    const id = newId();
    const title = input.title.trim();
    const description = (input.description ?? "").trim();

    db.prepare(
      "INSERT INTO tasks (id, title, description, completed, updatedAt) VALUES (?, ?, ?, ?, ?)"
    ).run(id, title, description, 0, now);

    res.status(201).json({ id, title, description, completed: false, updatedAt: now });
  } catch {
    res.status(400).json({ error: "Invalid body" } as any);
  }
});

/** PUT /tasks/:id */
tasksRouter.put<{ id: string }, Task, TaskPatch>("/:id", (req, res) => {
  const { id } = req.params;

  // 1) Lire & typer la ligne DB
  const existingRow = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id) as DBRow | undefined;
  if (!existingRow) return res.status(404).json({ error: "Task not found" } as any);
  const existing = rowToTask(existingRow); // ✅ objet typé Task

  // 2) Valider le patch (typé)
  let patch: TaskPatch;
  try {
    patch = TaskPatchSchema.parse(req.body);
  } catch {
    return res.status(400).json({ error: "Invalid body" } as any);
  }

  // 3) Construire la version suivante à partir d'un Task typé
  const next: Omit<Task, "id"> = {
    title: patch.title !== undefined ? patch.title.trim() : existing.title,
    description:
      patch.description !== undefined ? patch.description.trim() : existing.description,
    completed: patch.completed !== undefined ? !!patch.completed : existing.completed,
    updatedAt: Date.now(),
  };

  // 4) Persister
  db.prepare(
    "UPDATE tasks SET title = ?, description = ?, completed = ?, updatedAt = ? WHERE id = ?"
  ).run(next.title, next.description, next.completed ? 1 : 0, next.updatedAt, id);

  res.json({ id, ...next });
});

/** DELETE /tasks/:id */
tasksRouter.delete<{ id: string }>("/:id", (req, res) => {
  const { id } = req.params;
  const info = db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
  if (info.changes === 0) return res.status(404).json({ error: "Task not found" });
  res.status(204).send();
});
