import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export const registerHandler = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.registerUser(req.body);
    return res.status(201).json(result);
  } catch (e: any) {
    if (e.message === 'El usuario ya existe') {
      return res.status(409).json({ error: e.message });
    }
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const loginHandler = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.loginUser(req.body);
    return res.status(200).json(result);
  } catch (e: any) {
    if (e.message === 'Credenciales inválidas') {
      return res.status(401).json({ error: e.message });
    }
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const refreshHandler = async (req: Request, res: Response) => {
  try {
    const { refresh_token } = req.body;
    const result = await AuthService.refreshAuth(refresh_token);
    return res.status(200).json(result);
  } catch (e: any) {
    return res.status(401).json({ error: e.message });
  }
};
