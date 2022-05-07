import { FastifyInstance } from 'fastify'
import { IPaymentRequest } from '../interfaces/payment'
import { ServiceContext } from '../services'
import { paymentRequestSchema } from '../validations/payment'

async function paymentRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post<{
    Body: IPaymentRequest
  }>('/', { schema: paymentRequestSchema }, async (req, res) => {
    const service = ServiceContext.getInstance().getPaymentService()
    try {
      const result = await service.process(req.body)
      service.handleSuccessResponse(res, true, result)
    } catch (err) {
      service.handleErrorResponse(res, err)
    }
  })
}

export default paymentRoutes
