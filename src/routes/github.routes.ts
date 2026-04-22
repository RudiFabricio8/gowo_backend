import { Router } from 'express';
import { getGithubReposHandler } from '../controllers/github.controller';

const router = Router();

router.get('/:username/repos', getGithubReposHandler);

export default router;
