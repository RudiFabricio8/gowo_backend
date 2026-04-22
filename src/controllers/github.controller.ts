import { Request, Response } from 'express';
import { GithubService } from '../services/github.service';

export const getGithubReposHandler = async (req: Request, res: Response) => {
  try {
    const username = req.params.username as string;
    const repos = await GithubService.getPublicRepos(username);
    return res.status(200).json({ repos });
  } catch (e: any) {
    if (e.message === 'Usuario de GitHub no encontrado') {
      return res.status(404).json({ error: e.message });
    }
    return res.status(502).json({ error: 'Error al consultar la API de GitHub' });
  }
};
