import 'source-map-support/register'
import 'dotenv/config'
import fastify, { FastifyInstance } from 'fastify'

import ajv from './validations'
import logger from './utils/logger'
import { ServiceContext } from './services'
import { DBConnection } from './infra'
import { OrderService } from './services/order'
import { OrderModel } from './models'
import orderRoutes from './routes/order'

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
    this.instance.register(orderRoutes, { prefix: '/api/orders' })
  }

  async start(): Promise<string> {
    // open db connection
    await DBConnection.getInsance().authenticate()

    // db migration
    await OrderModel.sync({ force: false })

    // set context
    ServiceContext.getInstance().setOrderService(new OrderService())
    logger.info('setted service context')

    // bind
    const address = await this.instance.listen(this.listenPort, '0.0.0.0')
    logger.info(`Server is listening at ${address}`)
    return address
  }
}
