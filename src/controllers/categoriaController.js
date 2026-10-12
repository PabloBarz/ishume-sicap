import { categoriaService } from '../services/categoriaService.js';

export const categoriaController = {
  // Manejador para listar
  async listar(req, res) {
    try {
      const categorias = await categoriaService.obtenerTodas();
      return res.status(200).json({
        success: true,
        data: categorias
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Error al obtener categorías: ' + err.message
      });
    }
  },

  // Manejador para registrar
  async registrar(req, res) {
    try {
      const { nombre } = req.body;
      
      if (!nombre || nombre.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'El nombre de la categoría es obligatorio.'
        });
      }

      const nuevaCategoria = await categoriaService.crear(nombre);
      return res.status(201).json({
        success: true,
        message: 'Categoría creada exitosamente',
        data: nuevaCategoria
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Error al crear la categoría: ' + err.message
      });
    }
  }
};