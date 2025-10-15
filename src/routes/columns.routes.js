import express from "express";
import {
    getColumns,
    getColumnsByBoard,
    createColumn,
    updateColumn,
    deleteColumn
} from "../controllers/column.controller.js";

const router = express.Router();

router.get("/columns", getColumns);
router.get("columns/:columnId", getColumnsByBoard);
router.post("/columns", createColumn);
router.put("/:columnId", updateColumn);
router.delete("/:columnId", deleteColumn);

export default router;