import express from "express";
import boardsRoutes from "./boards.routes.js";
import usersRoutes from "./users.routes.js";
import tasksRoutes from "./tasks.routes.js";
import columnsRoutes from "./columns.routes.js";
import setupRoutes from "./setup.routes.js";

const router = express.Router();

// Barcha marshrutlarni bu yerda boshqaramiz
router.use("/boards", boardsRoutes);
router.use("/users", usersRoutes);
router.use("/tasks", tasksRoutes);
router.use("/columns", columnsRoutes);
router.use("/setup", setupRoutes);

export default router;