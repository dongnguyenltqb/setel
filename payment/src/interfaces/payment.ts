import { FromSchema } from 'json-schema-to-ts'
import { paymentRequestSchema } from '../validations/payment'

export interface IPaymentRequest
  extends FromSchema<typeof paymentRequestSchema.body> {}
