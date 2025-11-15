import type { infer as InferSchema } from 'zod'
import {
	errorModelSchema,
	forgotPasswordSchema,
	loginSchema,
	registerSchema,
	requestVerifyTokenSchema,
	resetPasswordSchema,
	userReadSchema,
	verifyTokenSchema,
} from './schemas'

export type LoginPayload = InferSchema<typeof loginSchema>
export type RegisterPayload = InferSchema<typeof registerSchema>
export type RequestVerifyTokenPayload = InferSchema<typeof requestVerifyTokenSchema>
export type VerifyTokenPayload = InferSchema<typeof verifyTokenSchema>
export type ForgotPasswordPayload = InferSchema<typeof forgotPasswordSchema>
export type ResetPasswordPayload = InferSchema<typeof resetPasswordSchema>
export type UserRead = InferSchema<typeof userReadSchema>
export type ErrorModel = InferSchema<typeof errorModelSchema>
