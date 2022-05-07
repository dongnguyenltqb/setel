import axios from 'axios'
import { Transaction } from 'sequelize'
import config from '../config'
import { ICreateOrder } from '../interfaces/order'
import { OrderModel, OrderStatus } from '../models'
import { NotFoundException, ValidateException } from '../utils/exception'
import logger from '../utils/logger'
import { Base } from './base'

export class OrderService extends Base {
  public async getById(id: number): Promise<OrderModel> {
    const order = await OrderModel.findOne({
      where: {
        id,
      },
    })
    return order
  }

  public async create(input: ICreateOrder): Promise<OrderModel> {
    const order = new OrderModel({
      ...input,
      status: OrderStatus.CREATED,
    })
    await order.save()
    this.triggerPayment(order)
    return order
  }

  public async triggerPayment(order: OrderModel): Promise<void> {
    logger.info(`trigger payment for order: %o`, order)
    try {
      const payment_host = config.payment_host
      const order_host = config.order_host
      await axios.post(payment_host + '/api/payments', {
        order_id: order.id,
        confirm_url: `${order_host}/api/orders/confirm/${order.id}`,
        cancel_url: `${order_host}/api/orders/cancel/${order.id}`,
      })
    } catch (err) {
      logger.error(
        `error: trigger payment for order: %o %s`,
        order,
        err.message,
      )
    }
  }

  public async confirm(id: number): Promise<OrderModel> {
    return await OrderModel.sequelize.transaction(
      {
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
      },
      async (tx) => {
        // check order status
        const order = await OrderModel.findOne({
          where: {
            id,
          },
          lock: Transaction.LOCK.UPDATE,
          transaction: tx,
        })
        if (!order) {
          throw new NotFoundException(`order ${id}`)
        }
        if (order.status !== OrderStatus.CREATED) {
          throw new ValidateException(`order ${id} already ${order.status}`)
        }
        // update order
        order.status = OrderStatus.CONFIRMED
        order.updated_at = new Date()
        await order.save({
          transaction: tx,
        })
        return order
      },
    )
  }

  public async cancel(id: number): Promise<OrderModel> {
    return await OrderModel.sequelize.transaction(
      {
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
      },
      async (tx) => {
        // check order status
        const order = await OrderModel.findOne({
          where: {
            id,
          },
          lock: Transaction.LOCK.UPDATE,
          transaction: tx,
        })
        if (!order) {
          throw new NotFoundException(`order ${id}`)
        }
        if (
          order.status == OrderStatus.CANCELED ||
          order.status === OrderStatus.DELIVERDED
        ) {
          throw new ValidateException(`order ${id} already ${order.status}`)
        }
        // update order
        order.status = OrderStatus.CANCELED
        order.updated_at = new Date()
        await order.save({
          transaction: tx,
        })
        return order
      },
    )
  }

  public async deliver(id: number): Promise<OrderModel> {
    return await OrderModel.sequelize.transaction(
      {
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
      },
      async (tx) => {
        // check order status
        const order = await OrderModel.findOne({
          where: {
            id,
          },
          lock: Transaction.LOCK.UPDATE,
          transaction: tx,
        })
        if (!order) {
          throw new NotFoundException(`order ${id}`)
        }
        if (order.status !== OrderStatus.CONFIRMED) {
          throw new ValidateException('only deliver confirmed orded')
        }
        // update order
        order.status = OrderStatus.DELIVERDED
        order.updated_at = new Date()
        await order.save({
          transaction: tx,
        })
        return order
      },
    )
  }
}
