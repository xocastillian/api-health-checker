import { useEffect } from 'react'
import { usersApi } from '../api/users/api'
import { useApiAction } from './useApiAction'
import { useAuth } from './useAuth'

type Options = {
	enabled?: boolean
}

const noop = () => {}

export const useCurrentUser = (options?: Options) => {
	const { user, error, isLoading, fetchCurrentUser, updateCurrentUser, resetError } = useAuth()
	const { enabled = true } = options ?? {}

	useEffect(() => {
		if (!enabled) return

		fetchCurrentUser().catch(noop)
	}, [enabled, fetchCurrentUser])

	return {
		user,
		error,
		isLoading,
		refresh: () => fetchCurrentUser(),
		update: updateCurrentUser,
		reset: resetError,
	}
}

export const useUserById = (userId?: string | number, options?: Options) => {
	const { data, error, execute, isLoading, reset } = useApiAction(usersApi.getUserById)
	const enabled = options?.enabled ?? true

	useEffect(() => {
		if (!enabled || userId === undefined || userId === null) {
			return
		}

		execute(userId).catch(noop)
	}, [enabled, userId, execute])

	return {
		user: data,
		error,
		isLoading,
		refetch: () => {
			if (userId === undefined || userId === null) {
				return Promise.reject(new Error('userId is not defined'))
			}

			return execute(userId)
		},
		reset,
	}
}

export const useUpdateCurrentUser = () => {
	const { updateCurrentUser, isLoading, error } = useAuth()
	return { update: updateCurrentUser, isLoading, error }
}

export const useUpdateUserById = () => useApiAction(usersApi.updateUserById)
export const useDeleteUserById = () => useApiAction(usersApi.deleteUserById)
