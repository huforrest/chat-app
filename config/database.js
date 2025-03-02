const mysql = require('mysql2');
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

console.log(`DB_HOST: ${DB_HOST}`);
console.log('\n');
console.log(`DB_USER: ${DB_USER}`);
console.log('\n');
console.log(`DB_PASSWORD: ${DB_PASSWORD}`);
console.log('\n');
console.log(`DB_NAME: ${DB_NAME}`);
console.log('\n');

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0
});

// 获取 Promise 版本的连接池
const promisePool = pool.promise();

module.exports = promisePool;