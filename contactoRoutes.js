import { Router } from 'express';
import contactController from './contactoController.js';

const router = Router();

// Ruta POST para enviar mensaje de contacto
router.post('/contact', contactController.sendContactEmail);

export default router;