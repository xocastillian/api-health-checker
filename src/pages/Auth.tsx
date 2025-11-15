import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { isAxiosError } from 'axios'
import AuthForm from '../widgets/Auth/AuthForm'
import type { AuthTabId, LoginFormValues, RegisterFormValues } from '../widgets/Auth/AuthForm'
import { useAuth } from '../hooks/useAuth'
import { authTabs } from '../widgets/Auth/constants'
import type { LoginPayload, RegisterPayload } from '../api/auth/types'
import EmailVerificationPanel, { type EmailVerificationFormValues } from '../components/EmailVerificationPanel'

const extractDetail = (detail: unknown): string | null => {
	if (!detail) {
		return null
	}

	if (typeof detail === 'string') {
		return detail
	}

	if (typeof detail === 'object') {
		const record = detail as Record<string, unknown>
		if (typeof record.reason === 'string') {
			return record.reason
		}
		if (typeof record.code === 'string') {
			return record.code
		}
	}

	try {
		return JSON.stringify(detail)
	} catch {
		return null
	}
}

const toErrorMessage = (error: unknown) => {
	if (!error) return null

	if (isAxiosError(error)) {
		const detail = extractDetail(error.response?.data?.detail)
		if (detail) {
			return detail
		}
		return error.response?.statusText ?? 'Ошибка при обращении к серверу'
	}

	if (error instanceof Error && error.message) return error.message
	if (typeof error === 'string') return error
	return 'Произошла ошибка. Попробуйте ещё раз.'
}

export const AuthPage = () => {
	const [activeTab, setActiveTab] = useState<AuthTabId>(authTabs[0].id)
	const [verificationEmail, setVerificationEmail] = useState<string | null>(null)
	const { user, login, register: registerUser, isLoading, error, resetError, requestVerifyToken, verifyToken } = useAuth()

	const loginForm = useForm<LoginFormValues>({
		defaultValues: { username: '', password: '' },
		mode: 'onChange',
	})

	const registerForm = useForm<RegisterFormValues>({
		defaultValues: { email: '', password: '', confirmPassword: '' },
		mode: 'onChange',
	})

	const verifyForm = useForm<EmailVerificationFormValues>({
		defaultValues: { token: '' },
		mode: 'onChange',
	})

	useEffect(() => {
		resetError()
		loginForm.reset()
		registerForm.reset()
	}, [activeTab, loginForm, registerForm, resetError])

	const triggerVerificationEmail = async (email: string) => {
		try {
			await requestVerifyToken({ email })
			setVerificationEmail(email)
		} catch (err) {
			console.error(err)
		}
	}

	const handleLogin = async (values: LoginFormValues) => {
		try {
			const payload: LoginPayload = {
				username: values.username.trim(),
				password: values.password,
				scope: '',
				grant_type: 'password',
				client_id: null,
				client_secret: null,
			}

			await login(payload)
		} catch (err) {
			console.error(err)
		}
	}

	const handleRegister = async (values: RegisterFormValues) => {
		if (values.password !== values.confirmPassword) {
			registerForm.setError('confirmPassword', { type: 'validate', message: 'Пароли не совпадают' })
			return
		}

		try {
			const email = values.email.trim()
			const payload: RegisterPayload = {
				email,
				password: values.password,
				is_active: true,
				is_superuser: false,
				is_verified: false,
				tg_id: null,
			}

			const userData = await registerUser(payload)
			setActiveTab('login')
			await triggerVerificationEmail(userData.email)
		} catch (err) {
			console.error(err)
		}
	}

	const handleVerifyToken = async (values: EmailVerificationFormValues) => {
		try {
			await verifyToken({ token: values.token.trim() })
			verifyForm.reset()
			setVerificationEmail(null)
		} catch (err) {
			console.error(err)
		}
	}

	const activeError = useMemo(() => toErrorMessage(error), [error])

	const verificationTargetEmail = verificationEmail ?? (user && !user.is_verified ? user.email : null)

	return (
		<div className='min-h-screen bg-slate-950 text-white px-4 py-10 flex items-center justify-center'>
			<div className='space-y-6 w-full max-w-2xl'>
				<AuthForm
					activeTab={activeTab}
					onTabChange={setActiveTab}
					isLoading={isLoading}
					userEmail={user?.email ?? null}
					errorMessage={activeError}
					loginForm={loginForm}
					registerForm={registerForm}
					onLogin={handleLogin}
					onRegister={handleRegister}
				/>

				{verificationTargetEmail && (
					<EmailVerificationPanel
						email={verificationTargetEmail}
						isLoading={isLoading}
						onResend={() => triggerVerificationEmail(verificationTargetEmail)}
						form={verifyForm}
						onSubmit={handleVerifyToken}
					/>
				)}
			</div>
		</div>
	)
}

export default AuthPage
