import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z
      .string()
      .min(1, 'El email es requerido')
      .email('Email inválido'),
    password: z
      .string()
      .min(1, 'La contraseña es requerida')
      .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    role: z.enum(['egresado', 'empresa']),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .min(1, 'El email es requerido')
      .email('Email inválido'),
    password: z
      .string()
      .min(1, 'La contraseña es requerida')
      .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refresh_token: z
      .string()
      .min(1, 'El refresh_token es requerido'),
  }),
});

// Infer kinds of types based on schemas
export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>['body'];
