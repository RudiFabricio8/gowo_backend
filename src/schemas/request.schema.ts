import { z } from 'zod';

export const createRequestSchema = z.object({
  body: z.object({
    profileId: z.string().uuid('ID de perfil inválido'),
    descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  }),
});

export const updateRequestSchema = z.object({
  body: z.object({
    estado: z.enum(['aceptada', 'rechazada']),
  }),
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>['body'];
export type UpdateRequestInput = z.infer<typeof updateRequestSchema>['body'];
