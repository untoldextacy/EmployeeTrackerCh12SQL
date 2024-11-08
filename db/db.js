const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',                 // Your PostgreSQL username
    host: 'localhost',
    database: 'employee_db',         // Your database name
    password: '1234', // Your PostgreSQL password
    port: 5432,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    end: () => pool.end(),
};
