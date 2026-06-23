import { Router } from 'express';
import { pdfController } from '../controllers/pdf.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.post('/:letterId/pdf', pdfController.download);

export default router;
