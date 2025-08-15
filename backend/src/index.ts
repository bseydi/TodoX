// backend/src/index.ts
import "dotenv/config";
import express from "express";
import cors from "cors";
import { tasksRouter } from "./tasks.router.js";

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.use(cors({ origin: ["http://localhost:5173"] }));
app.use(express.json()); // ✅ nécessaire pour req.body

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/tasks", tasksRouter);

app.use((_req, res) => res.status(404).json({ error: "Not found" }));
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal error" });
});

app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
