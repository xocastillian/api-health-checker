import { z } from 'zod'

export const loginSchema = z.object({
	username: z.string().min(1, 'Username is required'),
	password: z.string().min(1, 'Password is required'),
	scope: z.string().optional().default(''),
	grant_type: z.literal('password').default('password'),
	client_id: z.string().optional().nullable(),
	client_secret: z.string().optional().nullable(),
})

export const registerSchema = z.object({
	email: z.email({ message: 'Enter a valid email address' }),
	password: z.string().min(8, 'Password must be at least 8 characters').max(64),
	is_active: z.boolean().optional().default(false).nullable(),
	is_superuser: z.boolean().optional().default(false).nullable(),
	is_verified: z.boolean().optional().default(false).nullable(),
	tg_id: z.number().int().optional().nullable().nullable(),
})

export const requestVerifyTokenSchema = z.object({
	email: z.email({ message: 'Enter a valid email address' }),
})

export const verifyTokenSchema = z.object({
	token: z.string().min(1, 'Token is required'),
})

export const forgotPasswordSchema = z.object({
	email: z.email({ message: 'Enter a valid email address' }),
})

export const resetPasswordSchema = z.object({
	token: z.string().min(1, 'Token is required'),
	password: z.string().min(3, 'Password must be at least 3 characters'),
})

export const userReadSchema = z.object({
	id: z.number().int(),
	email: z.email(),
	is_active: z.boolean().default(false),
	is_superuser: z.boolean().default(false),
	is_verified: z.boolean().default(false),
	tg_id: z.number().int().nullable().optional(),
	created_at: z.iso.datetime(),
})

export const errorDetailRecordSchema = z.record(z.string(), z.string())

export const errorModelSchema = z.object({
	detail: z.union([z.string(), errorDetailRecordSchema]),
})
