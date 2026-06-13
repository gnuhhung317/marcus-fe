import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'Username or email is required'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  displayName: z.string().min(1, 'Display name is required').trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must include at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
    .regex(/\d/, 'Password must include at least one number'),
  role: z.enum(['TRADER', 'DEVELOPER']),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
