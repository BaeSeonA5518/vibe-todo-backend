import "dotenv/config";
import dns from "node:dns";
import mongoose from "mongoose";
import http from "node:http";
import {
  createTodoRoute,
  deleteTodoRoute,
  listTodosRoute,
  updateTodoRoute,
} from "./routes/todos.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
const PORT = 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/todo-backend";

const server = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", "*");

  const path = req.url.split("?")[0];

  if (req.method === "OPTIONS") {
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "GET" && path === "/health") {
    res.writeHead(200);
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  if (req.method === "GET" && path === "/todos") {
    await listTodosRoute(req, res);
    return;
  }

  if (req.method === "POST" && path === "/todos") {
    await createTodoRoute(req, res);
    return;
  }

  const todoById = path.match(/^\/todos\/([^/]+)$/);
  if (todoById) {
    const id = todoById[1];
    if (req.method === "PATCH" || req.method === "PUT") {
      await updateTodoRoute(req, res, id);
      return;
    }
    if (req.method === "DELETE") {
      await deleteTodoRoute(req, res, id);
      return;
    }
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "Not found" }));
});

async function start() {
  await mongoose.connect(MONGODB_URI);
  console.log("연결성공");

  server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
