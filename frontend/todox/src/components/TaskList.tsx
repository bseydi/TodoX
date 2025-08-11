// frontend/src/components/TaskList.tsx
import TaskItem from "./TaskItem";
import type { Task, TaskId, TaskPatch } from "../types/task";

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: TaskId) => void | Promise<void>;
  onDelete: (id: TaskId) => void | Promise<void>;
  onUpdate: (id: TaskId, patch: TaskPatch) => void | Promise<void>;
}

export default function TaskList({ tasks, onToggle, onDelete, onUpdate }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="text-gray-500 italic">Aucune tâche pour le moment.</p>;
  }
  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </ul>
  );
}
