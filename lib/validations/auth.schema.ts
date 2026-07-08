import { z } from 'zod';

type MessageFn = (key: string, values?: Record<string, string | number>) => string;

export function createLoginSchema(t: MessageFn) {
  return z.object({
    username: z.string().min(1, t('usernameRequired')),
    password: z.string().min(1, t('passwordRequired')),
  });
}

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;

export function createRegisterSchema(t: MessageFn) {
  return z.object({
    email: z.string().email(t('emailInvalid')),
    displayName: z.string().min(1, t('displayNameRequired')).trim(),
    password: z
      .string()
      .min(8, t('passwordMin'))
      .regex(/[a-z]/, t('passwordLowercase'))
      .regex(/[A-Z]/, t('passwordUppercase'))
      .regex(/\d/, t('passwordNumber')),
    role: z.enum(['TRADER', 'DEVELOPER']),
  });
}

export type RegisterFormValues = z.infer<ReturnType<typeof createRegisterSchema>>;
