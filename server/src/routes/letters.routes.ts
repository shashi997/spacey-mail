import { Router } from 'express';
import { letterController } from '../controllers/letter.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createLetterSchema } from '../validators/letter.schema.js';

const router = Router();

router.use(requireAuth);

router.post('/', validate(createLetterSchema), letterController.create);
router.get('/', letterController.list);
router.get('/:letterId', letterController.getById);
router.patch('/:letterId', letterController.update);

export default router;
