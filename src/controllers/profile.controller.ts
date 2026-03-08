import { Request, Response } from 'express';
import { ProfileService } from '../services/profile.service';

export const upsertProfileHandler = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.user.id;
    const profile = await ProfileService.upsertProfile(userId, req.body);
    return res.status(200).json({ profile });
  } catch (error: any) {
    return res.status(500).json({ error: 'Error interno del servidor al procesar el perfil' });
  }
};

export const getProfilesHandler = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await ProfileService.getProfiles(page, limit);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getProfileByIdHandler = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const profile = await ProfileService.getProfileById(id);
    return res.status(200).json({ profile });
  } catch (error: any) {
    if (error.message === 'Perfil no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
