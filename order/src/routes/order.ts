import { FastifyInstance } from 'fastify'
import { ServiceContext } from '../services'
import {
  ICancelOrder,
  IConfirmOrder,
  ICreateOrder,
  IGetOrder,
} from '../interfaces/order'
import {
  cancelOrderSchema,
  confirmOrderSchema,
  createOrderSchema,
  getOrderSchema,
} from '../validations/order'
import { NotFoundException } from '../utils/exception'

async function orderRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get<{
    Params: IGetOrder
  }>('/:id', { schema: getOrderSchema }, async (req, res) => {
    const id = req.params.id
    const service = ServiceContext.getInstance().getOrderService()
    try {
      const order = await service.getById(id)
      if (!order) {
        throw new NotFoundException(`order ${id}`)
      }
      service.handleSuccessResponse(res, true, order)
    } catch (err) {
      service.handleErrorResponse(res, err)
    }
  })

  fastify.post<{
    Body: ICreateOrder
  }>('/', { schema: createOrderSchema }, async (req, res) => {
    const service = ServiceContext.getInstance().getOrderService()
    try {
      const order = await service.create(req.body)
      service.handleSuccessResponse(res, true, order)
    } catch (err) {
      service.handleErrorResponse(res, err)
    }
  })

  fastify.post<{
    Params: IConfirmOrder
  }>('/confirm/:id', { schema: confirmOrderSchema }, async (req, res) => {
    const service = ServiceContext.getInstance().getOrderService()
    try {
      const id = req.params.id
      const order = await service.confirm(id)
      service.handleSuccessResponse(res, true, order)
    } catch (err) {
      service.handleErrorResponse(res, err)
    }
  })

  fastify.post<{
    Params: ICancelOrder
  }>('/cancel/:id', { schema: cancelOrderSchema }, async (req, res) => {
    const service = ServiceContext.getInstance().getOrderService()
    try {
      const id = req.params.id
      const order = await service.cancel(id)
      service.handleSuccessResponse(res, true, order)
    } catch (err) {
      service.handleErrorResponse(res, err)
    }
  })
}

export default orderRoutes
