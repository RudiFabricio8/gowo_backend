import { Router } from 'express';
import {
  upsertProfileHandler,
  getProfilesHandler,
  getProfileByIdHandler,
} from '../controllers/profile.controller';
import { requireAuth } from '../middlewares/requireAuth';
import validateResource from '../middlewares/validateResource';
import { createProfileSchema } from '../schemas/profile.schema';

const router = Router();

// Public Routes
router.get('/', getProfilesHandler);
router.get('/:id', getProfileByIdHandler);

// Protected Routes
router.post(
  '/',
  requireAuth,
  validateResource(createProfileSchema),
  upsertProfileHandler
);

export default router;
