import prisma from '../config/prisma';
import { CreateRequestInput } from '../schemas/request.schema';

export class RequestService {
  static async createRequest(empresaId: string, data: CreateRequestInput) {
    const profile = await prisma.profile.findUnique({ where: { id: data.profileId } });
    if (!profile) throw new Error('Perfil no encontrado');
    const existing = await prisma.request.findFirst({
      where: { empresaId, profileId: data.profileId, estado: 'pendiente' },
    });
    if (existing) throw new Error('Ya tienes una solicitud pendiente con este perfil');
    return prisma.request.create({
      data: { empresaId, profileId: data.profileId, descripcion: data.descripcion },
      include: { profile: { select: { nombre: true } } },
    });
  }

  static async getRequestsForUser(userId: string, role: string) {
    if (role === 'empresa') {
      return prisma.request.findMany({
        where: { empresaId: userId },
        include: { profile: { select: { nombre: true, rating: true } } },
        orderBy: { createdAt: 'desc' },
      });
    }
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) return [];
    return prisma.request.findMany({
      where: { profileId: profile.id },
      include: { empresa: { select: { email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async updateRequestStatus(
    requestId: string,
    userId: string,
    estado: 'aceptada' | 'rechazada'
  ) {
    const request = await prisma.request.findUnique({
      where: { id: requestId },
      include: { profile: true },
    });
    if (!request) throw new Error('Solicitud no encontrada');
    if (request.profile.userId !== userId) throw new Error('No autorizado');
    if (request.estado !== 'pendiente') throw new Error('Solo se pueden modificar solicitudes pendientes');
    return prisma.request.update({ where: { id: requestId }, data: { estado } });
  }
}
