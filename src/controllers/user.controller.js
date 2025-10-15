import { registerSchema, loginSchema } from "../validators/user.validator.js";
import bcrypt from 'bcrypt'
import { pool } from '../config/db.js'


// export const getAllUsers = async (req, res) => {
//     try {
//         const result = await pool.query('SELECT id, name, email FROM users')
//         res.json(result.rows)
//     } catch (err) {
//         next(err)
//     }
// }


export const getAllUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1; // hozirgi sahifa
        const limit = parseInt(req.query.limit) || 10; // har sahifadagi userlar soni
        const offset = (page - 1) * limit;

        const result = await pool.query(
            'SELECT id, name, email FROM users ORDER BY id LIMIT $1 OFFSET $2',
            [limit, offset]
        );

        // umumiy foydalanuvchilar sonini olish
        const countResult = await pool.query('SELECT COUNT(*) FROM users');
        const totalUsers = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalUsers / limit);

        res.json({
            page,
            totalPages,
            totalUsers,
            users: result.rows
        });
    } catch (err) {
        return next(err);
    }
};




export const getUserById = async (req, res, next) => {
    try {
        const { userId } = req.params
        const result = await pool.query('SELECT id, name, email FROM users WHERE id=$1', [userId])
        if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' })
        res.json(result.rows[0])
    } catch (err) {
        next(err)
    }
}


export const registerUser = async (req, res, next) => {
    const { error } = registerSchema.validate(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })
    try {
        const { name, email, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
            [name, email, hashedPassword]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        next(err)
    }
}


export const loginUser = async (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const { email, password } = req.body
        const result = await pool.query('SELECT * FROM users WHERE email=$1', [email])
        if (result.rows.length === 0)
            return res.status(400)
            .json({ error: 'User not found. Please check your email or register first.' })

        const user = result.rows[0]
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ error: 'Invalid password' })

        delete user.password // parolni javobdan olib tashlash

        res.status(200).json({
            success: true,
            message: `Welcome back, ${user.name || "User"}!`,
            user,
        })
    } catch (err) {
        next(err)
    }
}


export const updateUser = async (req, res, next) => {
    try {
        const { userId } = req.params
        const { name, email, password } = req.body

        const existingUser = await pool.query(
            'SELECT * FROM users WHERE id=$1', 
            [userId]
        )
        if (existingUser.rows.length === 0) 
            return res.status(404).json({ error: 'User not found' })
        const oldData = existingUser.rows[0];

        let hashedPassword = oldData.password;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        const newName = name || oldData.name;
        const newEmail = email || oldData.email;

        const result = await pool.query(
            'UPDATE users SET name=$1, email=$2, password=$3 WHERE id=$4 RETURNING id, name, email',
            [newName, newEmail, hashedPassword, userId]
        )
        res.json(result.rows[0])
    } catch (err) {
        next(err)
    }
}


export const deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.params

        await pool.query('UPDATE tasks SET userId = NULL WHERE userId=$1', [userId])

        const result = await pool.query('DELETE FROM users WHERE id=$1 RETURNING id', [userId])
        if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' })

        res.json({ message: 'User deleted successfully' })
    } catch (err) {
        next(err)
    }
}