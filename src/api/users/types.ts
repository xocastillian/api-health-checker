import type { infer as InferSchema } from 'zod'
import { userReadSchema } from '../auth/schemas'
import { userUpdateSchema } from './schemas'

export type UserRead = InferSchema<typeof userReadSchema>
export type UserUpdatePayload = InferSchema<typeof userUpdateSchema>
