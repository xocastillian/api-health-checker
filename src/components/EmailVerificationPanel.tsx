import type { UseFormReturn } from 'react-hook-form'

export type EmailVerificationFormValues = {
	token: string
}

type EmailVerificationPanelProps = {
	email: string
	isLoading: boolean
	onResend: () => void
	form: UseFormReturn<EmailVerificationFormValues>
	onSubmit: (values: EmailVerificationFormValues) => Promise<void> | void
}

export const EmailVerificationPanel = ({ email, isLoading, onResend, form, onSubmit }: EmailVerificationPanelProps) => (
	<div className='rounded-2xl border border-amber-400/40 bg-amber-500/10 px-6 py-5 text-sm text-amber-100 space-y-4'>
		<div>
			<p className='font-semibold text-amber-200'>Подтвердите ваш email</p>
			<p className='text-amber-100/80 mt-1'>
				Мы отправили код подтверждения на <span className='font-medium'>{email}</span>. Введите полученный токен ниже.
			</p>
		</div>

		<div className='flex items-center gap-3'>
			<button
				type='button'
				onClick={onResend}
				className='rounded-lg border border-amber-400/60 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-amber-200 hover:bg-amber-400/10 transition'
				disabled={isLoading}
			>
				Отправить письмо ещё раз
			</button>
		</div>

		<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
			<label className='block text-xs uppercase tracking-wide text-amber-200/80'>Токен подтверждения</label>
			<input
				type='text'
				placeholder='Введите токен из письма'
				{...form.register('token', { required: 'Введите токен' })}
				className='w-full rounded-xl border border-amber-400/60 bg-amber-500/5 px-4 py-3 text-sm text-white placeholder:text-amber-200/60 focus:border-white focus:outline-none focus:ring-1 focus:ring-white/70'
			/>
			{form.formState.errors.token && <p className='text-xs text-rose-200'>{form.formState.errors.token.message}</p>}

			<button
				type='submit'
				disabled={isLoading}
				className='w-full rounded-xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-amber-300 disabled:opacity-60'
			>
				Подтвердить токен
			</button>
		</form>
	</div>
)

export default EmailVerificationPanel
