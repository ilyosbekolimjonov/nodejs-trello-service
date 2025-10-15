import { pool } from "../config/db.js";

// GET all columns
export const getColumns = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;   
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const result = await pool.query(
            'SELECT * FROM columns ORDER BY id LIMIT $1 OFFSET $2',
            [limit, offset]
        );
        const countResult = await pool.query('SELECT COUNT(*) FROM columns');
        const totalColumns = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalColumns / limit);

        res.json({
            page,
            totalPages,
            totalColumns,
            columns: result.rows
        });
    } catch (err) {
        next(err);
    }
};

// GET columns by boardId
export const getColumnsByBoard = async (req, res, next) => {
    try {
        const { boardId } = req.params;
        const result = await pool.query("SELECT * FROM columns WHERE boardId = $1", [boardId]);
        res.json(result.rows);
    } catch (err) {
        next(err);
    }
};

// CREATE column
export const createColumn = async (req, res, next) => {
    try {
        const { boardId } = req.params;
        const { title } = req.body;

        const result = await pool.query(
            "INSERT INTO columns (title, boardId) VALUES ($1, $2) RETURNING *",
            [title, boardId]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        next(err);
    }
};

// UPDATE column
export const updateColumn = async (req, res, next) => {
    try {
        const { columnId } = req.params;
        const { title } = req.body;

        const result = await pool.query(
            "UPDATE columns SET title=$1 WHERE id=$2 RETURNING *",
            [title, columnId]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: "Column not found" });
        res.json(result.rows[0]);
    } catch (err) {
        next(err);
    }
};

// DELETE column
export const deleteColumn = async (req, res, next) => {
    try {
        const { columnId } = req.params;

        // O‘sha columndagi task'larni o'chir
        await pool.query("DELETE FROM tasks WHERE columnId=$1", [columnId]);

        const result = await pool.query("DELETE FROM columns WHERE id=$1 RETURNING *", [columnId]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Column not found" });

        res.json({ message: "Column and its tasks deleted" });
    } catch (err) {
        next(err);
    }
};
