import { z } from 'zod';

export const createProfileSchema = z.object({
  body: z.object({
    nombre: z
      .string()
      .min(1, 'El nombre es obligatorio'),
    experiencia_meses: z
      .number()
      .min(0, 'La experiencia no puede ser negativa')
      .optional(),
    skills: z
      .array(z.string())
      .optional(),
  }),
});

export type CreateProfileInput = z.infer<typeof createProfileSchema>['body'];
