import express from "express";
import {
    getColumns,
    getColumnsByBoard,
    createColumn,
    updateColumn,
    deleteColumn
} from "../controllers/column.controller.js";

const router = express.Router();

router.get("/", getColumns);
router.get("/:columnId", getColumnsByBoard);
router.post("/", createColumn);
router.put("/:columnId", updateColumn);
router.delete("/:columnId", deleteColumn);

export default router;