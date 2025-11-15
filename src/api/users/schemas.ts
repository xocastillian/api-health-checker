import { z } from 'zod'

export const userUpdateSchema = z.object({
	email: z.email({ message: 'Введите корректный email' }).optional().nullable(),
	password: z.string().min(8, 'Минимум 8 символов').max(64).optional().nullable(),
	is_active: z.boolean().optional().nullable(),
	is_superuser: z.boolean().optional().nullable(),
	is_verified: z.boolean().optional().nullable(),
	tg_id: z.number().int().optional().nullable(),
})
