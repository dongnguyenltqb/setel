import { Op } from 'sequelize'
import { OrderModel, OrderStatus } from '../models'
import config from '../config'
import { sleep_ms } from '../utils/helper'
import logger from '../utils/logger'
import { OrderService } from '../services/order'
import { DBConnection } from '../infra'

export async function deliverOrder() {
  await DBConnection.getInsance().authenticate()
  while (true) {
    try {
      const service = new OrderService()
      const orders = await OrderModel.findAll({
        where: {
          status: OrderStatus.CONFIRMED,
          updated_at: {
            [Op.lte]: new Date(
              1000 * (new Date().valueOf() / 1000 - config.deliver_time),
            ),
          },
        },
      })
      await Promise.all(
        orders.map(async (order) => {
          try {
            const orderId = order.id
            await service.deliver(orderId)
            logger.info(`delivered order ${orderId}`)
          } catch (err) {
            logger.error(err)
          }
        }),
      )
    } catch (err) {
      logger.error(err)
    }
    await sleep_ms(1_000)
  }
}
