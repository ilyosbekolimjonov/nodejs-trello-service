import { pool } from '../config/db.js'
import { createBoardSchema, updateBoardSchema } from "../validators/board.validator.js";

export const getAllBoards = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM boards')
        res.json(result.rows)
    } catch (err) {
        next(err)
    }
}

export const getBoardById = async (req, res) => {
    try {
        const { boardId } = req.params
        const result = await pool.query('SELECT * FROM boards WHERE id=$1', [boardId])
        if (result.rows.length === 0) return res.status(404).json({ error: 'Board not found' })
        res.json(result.rows[0])
    } catch (err) {
        next(err)
    }
}

export const createBoard = async (req, res) => {
    const { error } = createBoardSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const { title, columns } = req.body
        const result = await pool.query(
            'INSERT INTO boards (title, columns) VALUES ($1, $2) RETURNING *',
            [title, columns]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        next(err)
    }
}

export const updateBoard = async (req, res, next) => {
    const { error } = updateBoardSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const { boardId } = req.params
        const { title, columns } = req.body

        const oldData = await pool.query('SELECT * FROM boards WHERE id=$1', [boardId]);
        const current = oldData.rows[0]

        console.log(oldData)
        const newTitle = title ?? current.title
        const newColumns = columns ?? current.columns

        const result = await pool.query(
            'UPDATE boards SET title=$1, columns=$2 WHERE id=$3 RETURNING *',
            [title, columns, boardId]
        )
        if (result.rows.length === 0) return res.status(404).json({ error: 'Board not found' })
        res.json(result.rows[0])
    } catch (err) {
        next(err)
    }
}

export const deleteBoard = async (req, res, next) => {
    try {
        const { boardId } = req.params

        const result = await pool.query('DELETE FROM boards WHERE id=$1 RETURNING id', [boardId])
        if (result.rows.length === 0) return res.status(404).json({ error: 'Board not found' })

        res.json({ message: 'Board and related tasks deleted successfully' })
    } catch (err) {
        next(err)
    }
}
