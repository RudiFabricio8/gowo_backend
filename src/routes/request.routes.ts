import { Router } from 'express';
import { requireAuth } from '../middlewares/requireAuth';
import validateResource from '../middlewares/validateResource';
import { createRequestSchema, updateRequestSchema } from '../schemas/request.schema';
import {
  createRequestHandler,
  getRequestsHandler,
  updateRequestStatusHandler,
} from '../controllers/request.controller';

const router = Router();

router.post('/', requireAuth, validateResource(createRequestSchema), createRequestHandler);
router.get('/', requireAuth, getRequestsHandler);
router.patch('/:id', requireAuth, validateResource(updateRequestSchema), updateRequestStatusHandler);

export default router;
