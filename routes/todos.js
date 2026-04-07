import mongoose from "mongoose";
import { Todo } from "../models/Todo.js";
import { readJsonBody } from "../utils/readJsonBody.js";

/**
 * GET /todos — 할 일 목록
 */
export async function listTodosRoute(req, res) {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 }).lean();
    res.writeHead(200);
    res.end(JSON.stringify(todos));
  } catch (err) {
    res.writeHead(500);
    res.end(JSON.stringify({ error: String(err.message) }));
  }
}

/**
 * POST /todos — 할 일 생성
 */
export async function createTodoRoute(req, res) {
  try {
    const body = await readJsonBody(req);
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: "title is required" }));
      return;
    }
    const doc = await Todo.create({ title });
    res.writeHead(201);
    res.end(JSON.stringify(doc.toObject()));
  } catch (err) {
    if (err instanceof SyntaxError) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: "Invalid JSON body" }));
      return;
    }
    res.writeHead(500);
    res.end(JSON.stringify({ error: String(err.message) }));
  }
}

/**
 * PATCH / PUT /todos/:id — 할 일 수정 (본문: { "title": "..." })
 */
export async function updateTodoRoute(req, res, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.writeHead(400);
    res.end(JSON.stringify({ error: "Invalid id" }));
    return;
  }
  try {
    const body = await readJsonBody(req);
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: "title is required" }));
      return;
    }
    const doc = await Todo.findByIdAndUpdate(
      id,
      { title },
      { new: true, runValidators: true }
    );
    if (!doc) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Not found" }));
      return;
    }
    res.writeHead(200);
    res.end(JSON.stringify(doc.toObject()));
  } catch (err) {
    if (err instanceof SyntaxError) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: "Invalid JSON body" }));
      return;
    }
    res.writeHead(500);
    res.end(JSON.stringify({ error: String(err.message) }));
  }
}

/**
 * DELETE /todos/:id — 할 일 삭제
 */
export async function deleteTodoRoute(req, res, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.writeHead(400);
    res.end(JSON.stringify({ error: "Invalid id" }));
    return;
  }
  try {
    const doc = await Todo.findByIdAndDelete(id);
    if (!doc) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Not found" }));
      return;
    }
    res.writeHead(204);
    res.end();
  } catch (err) {
    res.writeHead(500);
    res.end(JSON.stringify({ error: String(err.message) }));
  }
}
