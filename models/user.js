const pool = require('../config/database');

class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    static async findAll() {
        const [results] = await pool.query('SELECT * FROM t_user');
        return results;
    }

    static async findById(id) {
        const [results] = await pool.query('SELECT * FROM t_user WHERE id = ?', [id]);
        return results[0];
    }

    static async findByName(username) {
        const [results] = await pool.query('SELECT * FROM t_user WHERE username = ?', [username]);
        return results[0];
    }

    static async insert(username, password) {
        try {
            const sql = 'INSERT INTO t_user (username, password) VALUES (?, ?)';
            const [result] = await pool.execute(sql, [username, password]);
            console.log('Inserted rows:', result.affectedRows);
            return result.affectedRows;
        } catch (error) {
            console.error('Error inserting data:', error);
        }
    }

    static async updateStatusById(status, id) {
        try {
            const sql = 'update t_user set status = ? where id = ?';
            const [result] = await pool.execute(sql, [status, id]);
            console.log('Updated rows:', result.affectedRows);
            return result.affectedRows;
        } catch (error) {
            console.error('Error inserting data:', error);
        }
    }
}

module.exports = User;