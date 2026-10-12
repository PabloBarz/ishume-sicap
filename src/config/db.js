import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER ,
  password: process.env.DB_PASSWORD ,
  database: process.env.DB_NAME ,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  timezone: '-05:00',
});

// Autoprueba de conexión al arrancar
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('Conexión a MySQL establecida correctamente');
    conn.release();
  } catch (err) {
    console.error('Error al conectar con MySQL:', err.message);
  }
})();

export default pool;