import { FromSchema } from 'json-schema-to-ts'
import {
  cancelOrderSchema,
  confirmOrderSchema,
  createOrderSchema,
  getOrderSchema,
} from '../validations/order'

export interface OrderPublic {
  id: number
  price: number
  status: number
  created_at: Date
  updated_at: Date
}

export interface IGetOrder extends FromSchema<typeof getOrderSchema.params> {}
export interface IConfirmOrder
  extends FromSchema<typeof confirmOrderSchema.params> {}
export interface ICancelOrder
  extends FromSchema<typeof cancelOrderSchema.params> {}
export interface ICreateOrder
  extends FromSchema<typeof createOrderSchema.body> {}
