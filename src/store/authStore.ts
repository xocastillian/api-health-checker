import { create } from 'zustand'
import { authApi } from '../api/auth/api'
import { usersApi } from '../api/users/api'
import type {
	ForgotPasswordPayload,
	LoginPayload,
	RegisterPayload,
	RequestVerifyTokenPayload,
	ResetPasswordPayload,
	UserRead,
	VerifyTokenPayload,
} from '../api/auth/types'
import type { UserUpdatePayload } from '../api/users/types'

type AuthState = {
	user: UserRead | null
	isLoading: boolean
	error: unknown
	login(payload: LoginPayload): Promise<UserRead>
	register(payload: RegisterPayload): Promise<UserRead>
	requestVerifyToken(payload: RequestVerifyTokenPayload): Promise<void>
	verifyToken(payload: VerifyTokenPayload): Promise<UserRead>
	forgotPassword(payload: ForgotPasswordPayload): Promise<void>
	resetPassword(payload: ResetPasswordPayload): Promise<void>
	fetchCurrentUser(): Promise<UserRead>
	updateCurrentUser(payload: UserUpdatePayload): Promise<UserRead>
	logout(): Promise<void>
	setUser(user: UserRead | null): void
	resetError(): void
}

export const useAuthStore = create<AuthState>(set => {
	const runWithLoading = async <T>(action: () => Promise<T>) => {
		set({ isLoading: true, error: null })
		try {
			const result = await action()
			set({ isLoading: false })
			return result
		} catch (error) {
			set({ isLoading: false, error })
			throw error
		}
	}

	return {
		user: null,
		isLoading: false,
		error: null,
		login: payload =>
			runWithLoading(async () => {
				const user = await authApi.login(payload)
				set({ user })
				return user
			}),
		register: payload =>
			runWithLoading(async () => {
				const user = await authApi.register(payload)
				set({ user })
				return user
			}),
		requestVerifyToken: payload => runWithLoading(() => authApi.requestVerifyToken(payload)),
		verifyToken: payload =>
			runWithLoading(async () => {
				const user = await authApi.verify(payload)
				set({ user })
				return user
			}),
		forgotPassword: payload => runWithLoading(() => authApi.forgotPassword(payload)),
		resetPassword: payload => runWithLoading(() => authApi.resetPassword(payload)),
		fetchCurrentUser: () =>
			runWithLoading(async () => {
				const user = await usersApi.getCurrentUser()
				set({ user })
				return user
			}),
		updateCurrentUser: payload =>
			runWithLoading(async () => {
				const user = await usersApi.updateCurrentUser(payload)
				set({ user })
				return user
			}),
		logout: () =>
			runWithLoading(async () => {
				await authApi.logout()
				set({ user: null })
			}),
		setUser: user => set({ user }),
		resetError: () => set({ error: null }),
	}
})
