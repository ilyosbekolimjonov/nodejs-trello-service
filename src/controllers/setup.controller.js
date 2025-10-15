import { pool } from '../config/db.js';

export const setUpDatabase = async (req, res, next) => {
    try {
        await pool.query(`
          CREATE TABLE IF NOT EXISTS users (
            id uuid PRIMARY KEY default gen_random_uuid(),
            name VARCHAR(100), 
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
          );
        `);

        await pool.query(`
          CREATE TABLE IF NOT EXISTS boards (
            id uuid PRIMARY KEY default gen_random_uuid(),
            title VARCHAR(255) NOT NULL, 
            userId uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE
          );
        `);

        await pool.query(`
          CREATE TABLE IF NOT EXISTS columns (
            id uuid PRIMARY KEY default gen_random_uuid(),
            title VARCHAR(255) NOT NULL,
            "order" INT NOT NULL,
            boardId uuid NOT NULL REFERENCES boards(id) ON DELETE CASCADE
          );
        `);

        await pool.query(`
          CREATE TABLE IF NOT EXISTS tasks (
            id uuid PRIMARY KEY default gen_random_uuid(),
            title VARCHAR(255) NOT NULL, 
            "order" INT NOT NULL, 
            description TEXT,
            userId uuid NOT NULL REFERENCES users(id) ON DELETE SET NULL,
            boardId uuid NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
            columnId uuid NOT NULL REFERENCES columns(id) ON DELETE CASCADE
          );
        `);

        res.status(201).json({
            message: 'Database setup completed successfully!',
        });
    } catch (err) {
      next(err)
    }
};