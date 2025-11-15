import { apiClient } from '../httpClient'
import { userRoutes } from '../routes'
import { userReadSchema } from '../auth/schemas'
import { userUpdateSchema } from './schemas'
import type { UserRead, UserUpdatePayload } from './types'

const buildUserPath = (id: string | number) => userRoutes.userById(id)

export const usersApi = {
	async getCurrentUser(): Promise<UserRead> {
		const { data } = await apiClient.get(userRoutes.currentUser)
		return userReadSchema.parse(data)
	},

	async updateCurrentUser(payload: UserUpdatePayload): Promise<UserRead> {
		const body = userUpdateSchema.parse(payload)
		const { data } = await apiClient.patch(userRoutes.currentUser, body)
		return userReadSchema.parse(data)
	},

	async getUserById(id: string | number): Promise<UserRead> {
		const { data } = await apiClient.get(buildUserPath(id))
		return userReadSchema.parse(data)
	},

	async updateUserById(id: string | number, payload: UserUpdatePayload): Promise<UserRead> {
		const body = userUpdateSchema.parse(payload)
		const { data } = await apiClient.patch(buildUserPath(id), body)
		return userReadSchema.parse(data)
	},

	async deleteUserById(id: string | number): Promise<void> {
		await apiClient.delete(buildUserPath(id))
	},
}

export type UsersApi = typeof usersApi
