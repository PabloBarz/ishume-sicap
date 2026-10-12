import pool from '../config/db.js';

export const categoriaService = {
  // Obtener todas las categorías
  async obtenerTodas() {
    const [rows] = await pool.query('SELECT * FROM categorias');
    return rows;
  },

  // Crear una nueva categoría
  async crear(nombre) {
    const [result] = await pool.query(
      'INSERT INTO categorias (nombre) VALUES (?)',
      [nombre]
    );
    return { id: result.insertId, nombre };
  }
};