import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Importación de rutas (aquí irás agregando las demás conforme las crees)
import categoriaRoutes from './src/routes/categoriaRoutes.js';
// import marcaRoutes from './src/routes/marcaRoutes.js';
// import modeloRoutes from './src/routes/modeloRoutes.js';
// import authRoutes from './src/routes/authRoutes.js';

// Configuración de __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;


//1. MIDDLEWARES GLOBALES

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos del frontend SPA (HTML, CSS, JS de public/)
app.use(express.static(path.join(__dirname, 'public')));

//2. RUTAS DE LA API (Arquitectura de 3 Capas)

app.use('/api/categorias', categoriaRoutes);
// app.use('/api/marcas', marcaRoutes);
// app.use('/api/modelos', modeloRoutes);
// app.use('/api/auth', authRoutes);


//3. SPA FALLBACK (Redirige al index.html)
//Permite que el enrutador del cliente maneje las vistas

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//4. CONTROLADOR DE ERRORES GLOBAL

app.use((err, req, res, next) => {
  console.error('Error no manejado:', err.stack);
  res.status(500).json({ success: false, message: 'Error interno del servidor' });
});

//5. INICIO DEL SERVIDOR

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app;