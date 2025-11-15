import { apiClient } from '../httpClient'
import { authRoutes, userRoutes } from '../routes'
import type {
	ForgotPasswordPayload,
	LoginPayload,
	RegisterPayload,
	RequestVerifyTokenPayload,
	ResetPasswordPayload,
	UserRead,
	VerifyTokenPayload,
} from './types'
import {
	forgotPasswordSchema,
	loginSchema,
	registerSchema,
	requestVerifyTokenSchema,
	resetPasswordSchema,
	userReadSchema,
	verifyTokenSchema,
} from './schemas'

const toFormData = (payload: Record<string, unknown>) => {
	const form = new URLSearchParams()

	Object.entries(payload).forEach(([key, value]) => {
		if (value === undefined || value === null) {
			return
		}

		form.append(key, String(value))
	})

	return form
}

export const authApi = {
	async login(payload: LoginPayload): Promise<UserRead> {
		const validatedPayload = loginSchema.parse(payload)
		const formBody = toFormData(validatedPayload)

		const response = await apiClient.post(authRoutes.login, formBody, {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		})

		const data = response.data

		if (!data || response.status === 204) {
			const { data: currentUser } = await apiClient.get(userRoutes.currentUser)
			return userReadSchema.parse(currentUser)
		}

		return userReadSchema.parse(data)
	},

	async logout(): Promise<void> {
		await apiClient.post(authRoutes.logout)
	},

	async register(payload: RegisterPayload): Promise<UserRead> {
		const body = registerSchema.parse(payload)
		const { data } = await apiClient.post(authRoutes.register, body)
		return userReadSchema.parse(data)
	},

	async requestVerifyToken(payload: RequestVerifyTokenPayload): Promise<void> {
		const body = requestVerifyTokenSchema.parse(payload)
		await apiClient.post(authRoutes.requestVerifyToken, body)
	},

	async verify(payload: VerifyTokenPayload): Promise<UserRead> {
		const body = verifyTokenSchema.parse(payload)
		const { data } = await apiClient.post(authRoutes.verify, body)
		return userReadSchema.parse(data)
	},

	async forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
		const body = forgotPasswordSchema.parse(payload)
		await apiClient.post(authRoutes.forgotPassword, body)
	},

	async resetPassword(payload: ResetPasswordPayload): Promise<void> {
		const body = resetPasswordSchema.parse(payload)
		await apiClient.post(authRoutes.resetPassword, body)
	},
}

export type AuthApi = typeof authApi
