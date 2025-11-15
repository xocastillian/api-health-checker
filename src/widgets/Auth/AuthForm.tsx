import type { UseFormReturn } from 'react-hook-form'
import { authTabs } from './constants'

export type LoginFormValues = {
	username: string
	password: string
}

export type RegisterFormValues = {
	email: string
	password: string
	confirmPassword: string
}

export type AuthTabId = (typeof authTabs)[number]['id']

type AuthFormProps = {
	activeTab: AuthTabId
	onTabChange: (tab: AuthTabId) => void
	isLoading: boolean
	userEmail: string | null
	errorMessage: string | null
	loginForm: UseFormReturn<LoginFormValues>
	registerForm: UseFormReturn<RegisterFormValues>
	onLogin: (values: LoginFormValues) => void | Promise<void>
	onRegister: (values: RegisterFormValues) => void | Promise<void>
}

const inputClasses =
	'w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500'

export const AuthForm = ({
	activeTab,
	onTabChange,
	isLoading,
	userEmail,
	errorMessage,
	loginForm,
	registerForm,
	onLogin,
	onRegister,
}: AuthFormProps) => (
	<div className='w-full max-w-md space-y-6'>
		<div className='flex justify-center gap-2 rounded-full bg-slate-900/70 p-1'>
			{authTabs.map(tab => (
				<button
					key={tab.id}
					type='button'
					onClick={() => onTabChange(tab.id)}
					className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
						activeTab === tab.id ? 'bg-white text-slate-900' : 'text-slate-300 hover:text-white'
					}`}
					disabled={isLoading}
				>
					{tab.label}
				</button>
			))}
		</div>

		<div className='rounded-2xl bg-slate-900/80 p-6 shadow-xl shadow-slate-900/40 border border-slate-800/60'>
			<h1 className='text-2xl font-semibold text-center mb-1'>API Health Checker</h1>
			<p className='text-center text-sm text-slate-400 mb-6'>{activeTab === 'login' ? 'Войдите чтобы продолжить' : 'Создайте новый аккаунт'}</p>

			{userEmail && (
				<div className='mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200'>
					Выполнен вход: <span className='font-medium'>{userEmail}</span>
				</div>
			)}

			{errorMessage && <div className='mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200'>{errorMessage}</div>}

			{activeTab === 'login' ? (
				<form onSubmit={loginForm.handleSubmit(onLogin)} className='space-y-4'>
					<div>
						<label className='block text-sm text-slate-300 mb-1'>Email / Логин</label>
						<input
							type='text'
							placeholder='you@example.com'
							{...loginForm.register('username', { required: 'Поле обязательно' })}
							className={inputClasses}
						/>
						{loginForm.formState.errors.username && <p className='mt-1 text-xs text-rose-400'>{loginForm.formState.errors.username.message}</p>}
					</div>

					<div>
						<label className='block text-sm text-slate-300 mb-1'>Пароль</label>
						<input
							type='password'
							placeholder='••••••••'
							{...loginForm.register('password', { required: 'Введите пароль' })}
							className={inputClasses}
						/>
						{loginForm.formState.errors.password && <p className='mt-1 text-xs text-rose-400'>{loginForm.formState.errors.password.message}</p>}
					</div>

					<button
						type='submit'
						disabled={isLoading}
						className='w-full rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:opacity-60'
					>
						{isLoading ? 'Загрузка...' : 'Войти'}
					</button>
				</form>
			) : (
				<form onSubmit={registerForm.handleSubmit(onRegister)} className='space-y-4'>
					<div>
						<label className='block text-sm text-slate-300 mb-1'>Email</label>
						<input
							type='email'
							placeholder='you@example.com'
							{...registerForm.register('email', { required: 'Введите email' })}
							className={inputClasses}
						/>
						{registerForm.formState.errors.email && <p className='mt-1 text-xs text-rose-400'>{registerForm.formState.errors.email.message}</p>}
					</div>

					<div>
						<label className='block text-sm text-slate-300 mb-1'>Пароль</label>
						<input
							type='password'
							placeholder='••••••••'
							{...registerForm.register('password', {
								required: 'Введите пароль',
								minLength: { value: 8, message: 'Минимум 8 символов' },
							})}
							className={inputClasses}
						/>
						{registerForm.formState.errors.password && <p className='mt-1 text-xs text-rose-400'>{registerForm.formState.errors.password.message}</p>}
					</div>

					<div>
						<label className='block text-sm text-slate-300 mb-1'>Подтверждение пароля</label>
						<input
							type='password'
							placeholder='••••••••'
							{...registerForm.register('confirmPassword', { required: 'Повторите пароль' })}
							className={inputClasses}
						/>
						{registerForm.formState.errors.confirmPassword && (
							<p className='mt-1 text-xs text-rose-400'>{registerForm.formState.errors.confirmPassword.message}</p>
						)}
					</div>

					<button
						type='submit'
						disabled={isLoading}
						className='w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:opacity-60'
					>
						{isLoading ? 'Создание...' : 'Зарегистрироваться'}
					</button>
				</form>
			)}
		</div>
	</div>
)

export default AuthForm
