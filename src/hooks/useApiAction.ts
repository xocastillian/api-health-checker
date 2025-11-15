import { useCallback, useState } from 'react'

type ApiFn<Args extends unknown[], Result> = (...args: Args) => Promise<Result>

export const useApiAction = <Args extends unknown[], Result>(apiFn: ApiFn<Args, Result>) => {
	const [data, setData] = useState<Result | null>(null)
	const [error, setError] = useState<unknown>(null)
	const [isLoading, setIsLoading] = useState(false)

	const execute = useCallback(
		async (...args: Args) => {
			setIsLoading(true)
			setError(null)

			try {
				const response = await apiFn(...args)
				setData((response ?? null) as Result | null)
				return response
			} catch (err) {
				setError(err)
				throw err
			} finally {
				setIsLoading(false)
			}
		},
		[apiFn]
	)

	const reset = useCallback(() => {
		setData(null)
		setError(null)
	}, [])

	return { data, error, isLoading, execute, reset }
}
