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

// GET columns by boardid
export const getColumnsById = async (req, res, next) => {
    try {
        const { columnId } = req.params;
        const result = await pool.query("SELECT * FROM columns WHERE columnId = $1", [columnId]);
        res.json(result.rows);
    } catch (err) {
        next(err);
    }
};

// CREATE column
export const createColumn = async (req, res, next) => {
    try {
        const { title, order, boardid } = req.body;

        const result = await pool.query(
            "INSERT INTO columns (title, \"order\", boardid) VALUES ($1, $2, $3) RETURNING *",
            [title, order, boardid]
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
        const { title, order, boardid } = req.body;

        const oldData = await pool.query("SELECT * FROM columns WHERE id=$1", [columnId]);
        const current = oldData.rows[0];
        
        const newTitle = title ?? current.title;
        const newOrder = order ?? current.order;
        const newboardid = boardid ?? current.boardid;

        const result = await pool.query(
            "UPDATE columns SET title=$1, \"order\"=$2, boardid=$3 WHERE id=$4 RETURNING *",
            [newTitle, newOrder, newboardid, columnId]
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

        await pool.query("DELETE FROM tasks WHERE \"columnId\"=$1", [columnId]);

        const result = await pool.query("DELETE FROM columns WHERE id=$1 RETURNING *", [columnId]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Column not found" });

        res.json({ message: "Column and its tasks deleted" });
    } catch (err) {
        next(err);
    }
};