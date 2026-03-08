import { Router } from 'express';
import {
  registerHandler,
  loginHandler,
  refreshHandler,
} from '../controllers/auth.controller';
import validateResource from '../middlewares/validateResource';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from '../schemas/auth.schema';

const router = Router();

router.post(
  '/register',
  validateResource(registerSchema),
  registerHandler
);

router.post('/login', validateResource(loginSchema), loginHandler);

router.post(
  '/refresh',
  validateResource(refreshTokenSchema),
  refreshHandler
);

export default router;
