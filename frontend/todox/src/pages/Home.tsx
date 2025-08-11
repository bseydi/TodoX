// frontend/src/pages/Home.tsx
import { useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import FilterTabs from "../components/FilterTabs";
import { useTasks } from "../hooks/useTasks";
import type { Task } from "../types/task";

type Filter = "all" | "active" | "completed";

export default function Home() {
  const { tasks, status, add, toggle, update, remove } = useTasks();
  const [filter, setFilter] = useState<Filter>("all");

  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.length - activeCount;

  const visibleTasks: Task[] =
    filter === "all"
      ? tasks
      : filter === "active"
      ? tasks.filter((t) => !t.completed)
      : tasks.filter((t) => t.completed);

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ma Todo List 📝</h1>

      <TaskForm onAdd={add} />

      <div className="flex items-center gap-3 mb-2">
        <span className="text-sm text-gray-600">
          {activeCount} en cours / {completedCount} complétées
        </span>
        {status === "loading" && (
          <span className="text-xs text-gray-500">Chargement…</span>
        )}
        {status === "error" && (
          <span className="text-xs text-red-600">Erreur de lecture locale</span>
        )}
      </div>

      <FilterTabs
        value={filter}
        activeCount={activeCount}
        completedCount={completedCount}
        onChange={setFilter}
      />

      <TaskList tasks={visibleTasks} onToggle={toggle} onDelete={remove} onUpdate={update} />
    </div>
  );
}
