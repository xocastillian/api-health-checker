export const authRoutes = {
	login: '/auth/cookie/login',
	logout: '/auth/cookie/logout',
	register: '/auth/register',
	requestVerifyToken: '/auth/request-verify-token',
	verify: '/auth/verify',
	forgotPassword: '/auth/forgot-password',
	resetPassword: '/auth/reset-password',
} as const

type RouteValue<T extends Record<string, string>> = T[keyof T]

export type AuthRoute = RouteValue<typeof authRoutes>

export const userRoutes = {
	currentUser: '/users/me',
	userById: (id: string | number) => `/users/${id}`,
} as const
