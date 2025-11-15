import { useShallow } from 'zustand/react/shallow'
import { useAuthStore } from '../store/authStore'

export const useAuth = () =>
	useAuthStore(
		useShallow(store => ({
			user: store.user,
			isLoading: store.isLoading,
			error: store.error,
			login: store.login,
			logout: store.logout,
			register: store.register,
			requestVerifyToken: store.requestVerifyToken,
			verifyToken: store.verifyToken,
			forgotPassword: store.forgotPassword,
			resetPassword: store.resetPassword,
			fetchCurrentUser: store.fetchCurrentUser,
			updateCurrentUser: store.updateCurrentUser,
			resetError: store.resetError,
		}))
	)
