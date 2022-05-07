import 'source-map-support/register'
import 'dotenv/config'
import fastify, { FastifyInstance } from 'fastify'

import ajv from './validations'
import logger from './utils/logger'
import { ServiceContext } from './services'
import paymentRoute from './routes/payment'
import { PaymentService, PaymentStatus } from './services/payment'

export default class Server {
  private instance: FastifyInstance
  private listenPort: number

  constructor(port: number) {
    this.listenPort = port
    this.instance = fastify({
      logger: false,
    })
    this.instance.setValidatorCompiler(({ schema }) => {
      return ajv.compile(schema)
    })
    this.instance.register(paymentRoute, { prefix: '/api/payments' })
  }

  async start(): Promise<string> {
    // set context
    ServiceContext.getInstance().setPaymentService(
      new PaymentService((orderId: number): PaymentStatus => {
        if (orderId % 2 == 0) {
          return PaymentStatus.CONFIRMED
        }
        return PaymentStatus.DECLINED
      }),
    )
    logger.info('setted service context')

    // bind
    const address = await this.instance.listen(this.listenPort, '0.0.0.0')
    logger.info(`Server is listening at ${address}`)
    return address
  }
}
