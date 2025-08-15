// backend/src/db.ts
import Database from "better-sqlite3";
import { randomUUID } from "node:crypto";

export const db = new Database("data.sqlite", { fileMustExist: false });
db.pragma("journal_mode = WAL");
db.exec(`
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  completed INTEGER NOT NULL DEFAULT 0,
  updatedAt INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_tasks_updatedAt ON tasks(updatedAt DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
`);

export function newId(): string {
  try {
    return randomUUID();
  } catch {
    return "id_" + Date.now() + "_" + Math.random().toString(36).slice(2);
  }
}
