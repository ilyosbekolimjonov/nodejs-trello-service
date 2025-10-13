
import bcrypt from 'bcrypt'
import { pool } from '../config/db.js'


export const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, email FROM users')
        res.json(result.rows)
    } catch (err) {
        next(err)
    }
}


export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params
        const result = await pool.query('SELECT id, name, email FROM users WHERE id=$1', [userId])
        if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' })
        res.json(result.rows[0])
    } catch (err) {
        next(err)
    }
}


export const registerUser = async (req, res) => {
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


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const result = await pool.query('SELECT * FROM users WHERE email=$1', [email])
        if (result.rows.length === 0) return res.status(400).json({ error: 'User not found' })

        const user = result.rows[0]
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' })

        delete user.password
        res.json(user)
    } catch (err) {
        next(err)
    }
}


export const updateUser = async (req, res) => {
    try {
        const { userId } = req.params
        const { name, email } = req.body
        const result = await pool.query(
            'UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING id, name, email',
            [name, email, userId]
        )
        if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' })
        res.json(result.rows[0])
    } catch (err) {
        next(err)
    }
}


export const deleteUser = async (req, res) => {
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