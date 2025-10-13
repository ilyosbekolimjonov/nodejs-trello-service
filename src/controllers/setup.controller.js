
import { pool } from '../config/db.js';

export const setUpDatabase = async (req, res, next) => {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        password VARCHAR(255)
      );
    `);

        
        await pool.query(`
      CREATE TABLE IF NOT EXISTS boards (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        columns TEXT
      );
    `);

        
        await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        "order" INT,
        description TEXT,
        "userId" INT REFERENCES users(id) ON DELETE SET NULL,
        "boardId" INT REFERENCES boards(id) ON DELETE CASCADE,
        "columnId" INT
      );
    `);

        res.status(201).json({
            message: 'Database setup completed successfully!',
        });
    } catch (err) {
      next(err)
    }
};