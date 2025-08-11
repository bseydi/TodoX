// frontend/src/hooks/useTasks.ts
import { useEffect, useState } from "react";
import { db } from "../db/todox-db";
import type { Task, TaskId, TaskInput, TaskPatch } from "../types/task";

type Status = "idle" | "loading" | "error";

/** Source unique de vérité pour CRUD local; facilite la future synchro. */
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setStatus("loading");
      try {
        const all = await db.tasks.orderBy("updatedAt").reverse().toArray();
        if (!cancelled) {
          setTasks(all);
          setStatus("idle");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const add = async (input: TaskInput) => {
    const now = Date.now();
    const task: Task = {
      title: input.title.trim(),
      description: input.description.trim(),
      completed: false,
      updatedAt: now,
    };
    const id = await db.tasks.add(task);
    const saved = { ...task, id };
    setTasks((prev) => [saved, ...prev]);
  };

  const toggle = async (id: TaskId) => {
    const existing = await db.tasks.get(id);
    if (!existing) return;
    const updated: Task = {
      ...existing,
      completed: !existing.completed,
      updatedAt: Date.now(),
    };
    await db.tasks.put(updated);
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? updated : t)).sort((a, b) => b.updatedAt - a.updatedAt)
    );
  };

  const update = async (id: TaskId, patch: TaskPatch) => {
    const existing = await db.tasks.get(id);
    if (!existing) return;
    const next: Task = {
      ...existing,
      ...("title" in patch ? { title: patch.title?.trim() ?? existing.title } : {}),
      ...("description" in patch
        ? { description: patch.description?.trim() ?? existing.description }
        : {}),
      ...("completed" in patch ? { completed: !!patch.completed } : {}),
      updatedAt: Date.now(),
    };
    await db.tasks.put(next);
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? next : t)).sort((a, b) => b.updatedAt - a.updatedAt)
    );
  };

  const remove = async (id: TaskId) => {
    await db.tasks.delete(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return { tasks, status, add, toggle, update, remove };
}
