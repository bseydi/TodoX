// frontend/src/db/todo-db.ts
import Dexie, { type Table } from "dexie";
import type { Task } from "../types/task";

export class TodoxDB extends Dexie {
  tasks!: Table<Task, number>;
  constructor() {
    super("todox-db");
    this.version(1).stores({
      tasks: "++id, completed, updatedAt, title", // indexes
    });
  }
}

export const db = new TodoxDB();