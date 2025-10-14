import express from "express";
import {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
} from "../controllers/tasks.controller.js";

const router = express.Router();

router.get("/boards/:boardId/tasks", getTasks);
router.get("/boards/:boardId/tasks/:taskId", getTaskById);
router.post("/boards/:boardId/tasks", createTask);
router.put("/boards/:boardId/tasks/:taskId", updateTask);
router.delete("/boards/:boardId/tasks/:taskId", deleteTask);

export default router;
