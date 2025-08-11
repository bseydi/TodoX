// frontend/src/components/TaskItem.tsx
import { useState } from "react";
import type { Task, TaskId, TaskPatch } from "../types/task";

interface TaskItemProps {
  task: Task;
  onToggle: (id: TaskId) => void | Promise<void>;
  onDelete: (id: TaskId) => void | Promise<void>;
  onUpdate: (id: TaskId, patch: TaskPatch) => void | Promise<void>;
}

/** Édition inline locale; évite de propager état d'édition global. */
export default function TaskItem({ task, onToggle, onDelete, onUpdate }: TaskItemProps) {
  const [editing, setEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(task.title);
  const [description, setDescription] = useState<string>(task.description);

  const startEdit = () => {
    setTitle(task.title);
    setDescription(task.description);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setTitle(task.title);
    setDescription(task.description);
  };

  const saveEdit = async () => {
    if (!task.id) return;
    const nextTitle = title.trim();
    if (!nextTitle) return; // why: éviter titres vides
    await onUpdate(task.id, { title: nextTitle, description });
    setEditing(false);
  };

  return (
    <li
      className={`p-3 border rounded flex justify-between items-start gap-3 ${
        task.completed ? "bg-green-100" : "bg-white"
      }`}
    >
      <div className="min-w-0 flex-1">
        {editing ? (
          <>
            <input
              className="border p-2 rounded w-full mb-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre"
            />
            <textarea
              className="border p-2 rounded w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />
          </>
        ) : (
          <>
            <h3
              className={`font-bold break-words ${
                task.completed ? "line-through" : ""
              }`}
              title={task.title}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-700 break-words">{task.description}</p>
            )}
          </>
        )}
      </div>

      <div className="flex gap-2 shrink-0">
        {!editing ? (
          <>
            <button
              onClick={() => task.id && onToggle(task.id)}
              className="bg-yellow-400 px-2 py-1 rounded"
            >
              {task.completed ? "Annuler" : "Compléter"}
            </button>
            <button onClick={startEdit} className="bg-blue-500 text-white px-2 py-1 rounded">
              Modifier
            </button>
            <button
              onClick={() => task.id && onDelete(task.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Supprimer
            </button>
          </>
        ) : (
          <>
            <button onClick={saveEdit} className="bg-green-600 text-white px-2 py-1 rounded">
              Enregistrer
            </button>
            <button onClick={cancelEdit} className="bg-gray-300 px-2 py-1 rounded">
              Annuler
            </button>
          </>
        )}
      </div>
    </li>
  );
}
