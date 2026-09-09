import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

import authRouter from "../routes/auth.route.js";
import notesRouter from "../routes/notes.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// API routes
app.use("/api/auth", authRouter);  // authentication routes

app.use("/api/notes", notesRouter); // notes routes

// Serve frontend static build
const publicPath = path.join(__dirname, "../../public");
app.use(express.static(publicPath));

// SPA fallback — serve index.html for all non-API routes
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

export default app;