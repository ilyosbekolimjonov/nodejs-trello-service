import { pool } from '../config/db.js'
import { createBoardSchema, updateBoardSchema } from "../validators/board.validator.js";

// export const getAllBoards = async (req, res, next) => {
//     try {
//         const page = parseInt(req.query.page) || 1;   
//         const limit = parseInt(req.query.limit) || 10;
//         const offset = (page - 1) * limit;

//         const result = await pool.query(
//             'SELECT * FROM boards ORDER BY id LIMIT $1 OFFSET $2',
//             [limit, offset]
//         );

//         const countResult = await pool.query('SELECT COUNT(*) FROM boards');
//         const totalBoards = parseInt(countResult.rows[0].count);
//         const totalPages = Math.ceil(totalBoards / limit);

//         res.json({
//             page,
//             totalPages,
//             totalBoards,
//             boards: result.rows
//         });
//     } catch (err) {
//         next(err);
//     }
// };

export const getAllBoards = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const offset = (page - 1) * limit;

        let query = `
            SELECT * FROM boards
        `;
        let countQuery = `
            SELECT COUNT(*) FROM boards
        `;
        const values = [];

        if (search) {
            query += ` WHERE title ILIKE $1`;
            countQuery += ` WHERE title ILIKE $1`;
            values.push(`%${search}%`);
        }

        // Pagination parametrlari
        query += ` ORDER BY id LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
        values.push(limit, offset);

        const result = await pool.query(query, values);
        const countResult = await pool.query(countQuery, search ? [`%${search}%`] : []);
        const totalBoards = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalBoards / limit);

        res.json({
            page,
            totalPages,
            totalBoards,
            boards: result.rows,
        });
    } catch (err) {
        next(err);
    }
};

export const getBoardById = async (req, res, next) => {
    try {
        const { boardId } = req.params
        const result = await pool.query('SELECT * FROM boards WHERE id=$1', [boardId])
        if (result.rows.length === 0) return res.status(404).json({ error: 'Board not found' })
        res.json(result.rows[0])
    } catch (err) {
        next(err)
    }
}

export const createBoard = async (req, res, next) => {
    const { error } = createBoardSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const { title, userId } = req.body
        const result = await pool.query(
            'INSERT INTO boards (title, userId) VALUES ($1, $2) RETURNING *',
            [title, userId]
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
