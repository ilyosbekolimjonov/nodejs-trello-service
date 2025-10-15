import { pool } from "../config/db.js";
import { createTaskSchema, updateTaskSchema } from "../validators/task.validator.js";

// GET all tasks by board
export const getTasks = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;   
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const result = await pool.query(
            'SELECT * FROM tasks ORDER BY id LIMIT $1 OFFSET $2',
            [ limit, offset]
        );

        const countResult = await pool.query('SELECT COUNT(*) FROM tasks');
        const totalTasks = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalTasks / limit);
        
        res.json({
            page,
            totalPages, 
            totalTasks,
            tasks: result.rows
        });

    } catch (err) {
        next(err);
    }
};

// GET task by ID
export const getTaskById = async (req, res, next) => {
    try {
        const { boardId, taskId } = req.params;
        const result = await pool.query(
            "SELECT * FROM tasks WHERE boardId=$1 AND id=$2",
            [boardId, taskId]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: "Task not found" });
        res.json(result.rows[0]);
    } catch (err) {
        next(err);
    }
};

// CREATE task
export const createTask = async (req, res, next) => {
    const { error } = createTaskSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const { boardId } = req.params;
        const { title, order, description, userId, columnId } = req.body;

        const result = await pool.query(
            `INSERT INTO tasks (title, "order", description, "userId", "boardId", "columnId")
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [title, order, description, userId, boardId, columnId]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        next(err);
    }
};

// UPDATE task
export const updateTask = async (req, res, next) => {
    const { error } = updateTaskSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const { boardId, taskId } = req.params;
        const { title, order, description, userId, columnId } = req.body;

        const result = await pool.query(
            `UPDATE tasks 
            SET title=$1, "order"=$2, description=$3, "userId"=$4, "columnId"=$5
            WHERE id=$6 AND "boardId"=$7
            RETURNING *`,
            [title, order, description, userId, columnId, taskId, boardId]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: "Task not found" });
        res.json(result.rows[0]);
    } catch (err) {
        next(err);
    }
};

// DELETE task
export const deleteTask = async (req, res, next) => {
    try {
        const { boardId, taskId } = req.params;

        const result = await pool.query(
            "DELETE FROM tasks WHERE id=$1 AND boardId=$2 RETURNING *",
            [taskId, boardId]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: "Task not found" });
        res.json({ message: "Task deleted" });
    } catch (err) {
        next(err);
    }
};
