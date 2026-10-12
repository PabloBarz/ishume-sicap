import { Router } from 'express';
import { categoriaController } from '../controllers/categoriaController.js';

const router = Router();

// Definición de endpoints
router.get('/', categoriaController.listar);
router.post('/', categoriaController.registrar);

export default router;