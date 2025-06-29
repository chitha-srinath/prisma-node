import { z, object, string } from 'zod';

export const LoginDto = object({
  email: string().email({ message: 'enter valid email' }),
  password: string()
    .min(6, { message: 'password length should be minimum of 6 characters' })
    .max(64, { message: 'password length should be maximum of64 characters' }),
}).strict();
export const RegisterDto = object({
  email: string().email({ message: 'enter valid email' }),
  password: string()
    .min(6, { message: 'password length should be minimum of 6 characters' })
    .max(64, { message: 'password length should be maximum of64 characters' }),
}).strict();
export type LoginPostDto = z.infer<typeof LoginDto>;
export type RegisterPostDto = z.infer<typeof RegisterDto>;
