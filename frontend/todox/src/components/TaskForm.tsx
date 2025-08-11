// frontend/src/components/TaskForm.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import type { TaskInput } from "../types/task";

interface TaskFormProps {
  onAdd: (task: TaskInput) => void | Promise<void>;
}

export default function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;
    await onAdd({ title, description });
    setTitle("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-2">
      <input
        className="border p-2 rounded"
        type="text"
        placeholder="Titre de la tâche"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="border p-2 rounded"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit" className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
        Ajouter
      </button>
    </form>
  );
}
