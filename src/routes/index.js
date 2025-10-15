import express from "express";
import authRoutes from "./auth.routes.js";
import boardsRoutes from "./boards.routes.js";
import usersRoutes from "./users.routes.js";
import tasksRoutes from "./tasks.routes.js";
import columnsRoutes from "./columns.routes.js";
import setupRoutes from "./setup.routes.js";

const router = express.Router();

// Barcha marshrutlarni bu yerda
router.use("/auth", authRoutes);
router.use("/", boardsRoutes);
router.use("/", usersRoutes);
router.use("/", tasksRoutes);
router.use("/", columnsRoutes);
router.use("/", setupRoutes);

export default router;