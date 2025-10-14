import pool from "../config/db.js";

// Universal SELECT
export const findAll = async (table) => {
    const result = await pool.query(`SELECT * FROM ${table}`);
    return result.rows;
};

// Find by ID
export const findById = async (table, id) => {
    const result = await pool.query(`SELECT * FROM ${table} WHERE id=$1`, [id]);
    return result.rows[0];
};

// Delete by ID
export const deleteById = async (table, id) => {
    const result = await pool.query(`DELETE FROM ${table} WHERE id=$1 RETURNING *`, [id]);
    return result.rows[0];
};
