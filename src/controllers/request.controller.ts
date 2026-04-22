import { Request, Response } from 'express';
import { RequestService } from '../services/request.service';

export const createRequestHandler = async (req: Request, res: Response) => {
  try {
    const { id, role } = res.locals.user;
    if (role !== 'empresa') {
      return res.status(403).json({ error: 'Solo las empresas pueden enviar solicitudes' });
    }
    const request = await RequestService.createRequest(id, req.body);
    return res.status(201).json({ request });
  } catch (e: any) {
    if (e.message === 'Perfil no encontrado') return res.status(404).json({ error: e.message });
    if (e.message.includes('pendiente')) return res.status(409).json({ error: e.message });
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getRequestsHandler = async (req: Request, res: Response) => {
  try {
    const { id, role } = res.locals.user;
    const requests = await RequestService.getRequestsForUser(id, role);
    return res.status(200).json({ requests });
  } catch {
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateRequestStatusHandler = async (req: Request, res: Response) => {
  try {
    const { id: userId } = res.locals.user;
    const requestId = req.params.id as string;
    const { estado } = req.body;
    const request = await RequestService.updateRequestStatus(requestId, userId, estado);
    return res.status(200).json({ request });
  } catch (e: any) {
    if (e.message === 'Solicitud no encontrada') return res.status(404).json({ error: e.message });
    if (e.message === 'No autorizado') return res.status(403).json({ error: e.message });
    if (e.message.includes('pendientes')) return res.status(400).json({ error: e.message });
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
