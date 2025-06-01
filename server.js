// server.js para producción y desarrollo moderno
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import contactoRoutes from './contactoRoutes.js';

// Configuración inicial
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Configuración CORS según el entorno
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://tdigestion.com', 'https://www.tdigestion.com', 'https://tdihtml.onrender.com/api/contacto/contact']
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Log de rutas para debugging (debe ir primero)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Middleware de seguridad básico
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Middlewares básicos
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas API (deben ir antes de los archivos estáticos)
app.use('/api/contacto', contactoRoutes);

// Servir archivos estáticos desde la carpeta actual
app.use(express.static(__dirname));

// Rutas para páginas HTML
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.get('/contacto', (req, res) => {
  res.sendFile(join(__dirname, 'contacto.html'));
});

// Manejador de errores 404
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'La ruta solicitada no existe'
  });
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Ha ocurrido un error en el servidor'
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
