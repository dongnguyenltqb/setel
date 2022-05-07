import { describe } from 'mocha'
import { expect } from 'chai'
import axios from 'axios'

import config from '../config'
import Server from '../server'
import { OrderModel, OrderStatus } from '../models'
import { NotFoundException, ValidateException } from '../utils/exception'

describe('order test', function () {
  this.beforeAll(async function () {
    this.timeout(10_000)
    const server = new Server(Number(config.server_port))
    await server.start()
  })

  this.afterAll(function (done) {
    OrderModel.destroy({
      where: {
        name: 'test',
      },
    }).then(() => done())
  })

  const host = `http://localhost:${config.server_port}`
  describe('create order', function () {
    it('should creat successfully', async function () {
      const { data } = await axios.post(host + '/api/orders', {
        name: 'test',
        price: 100,
      })
      expect(data.result.status).to.equal(OrderStatus.CREATED)
    })
  })

  describe('get order', function () {
    it('should get successfully', async function () {
      const order = new OrderModel({
        name: 'test',
        price: 100,
        status: OrderStatus.CREATED,
      })
      await order.save()
      const orderId = order.id
      const res = await axios.get(host + '/api/orders/' + orderId)
      expect(res.data.result.status).to.equal(OrderStatus.CREATED)
      expect(res.data.result.id).to.equal(orderId)
    })
    it('should get unsucessfully', async function () {
      const orderId = 1010101001010101
      try {
        await axios.get(host + '/api/orders/' + orderId)
      } catch (err) {
        expect(err.response.data.status).to.equal(false)
        expect(err.response.data.message).to.equal(
          new NotFoundException(`order ${orderId}`).message,
        )
      }
    })
  })

  describe('confirm/cancel order', function () {
    it('should cancel successfully', async function () {
      const order = new OrderModel({
        name: 'test',
        price: 100,
        status: OrderStatus.CREATED,
      })
      await order.save()
      const orderId = order.id
      const { data } = await axios.post(
        host + '/api/orders/cancel/' + orderId,
        {},
      )
      expect(data.result.status).to.equal(OrderStatus.CANCELED)
    })

    it('should cancel confimed order successfully', async function () {
      const order = new OrderModel({
        name: 'test',
        price: 100,
        status: OrderStatus.CONFIRMED,
      })
      await order.save()
      const orderId = order.id
      const { data } = await axios.post(
        host + '/api/orders/cancel/' + orderId,
        {},
      )
      expect(data.result.status).to.equal(OrderStatus.CANCELED)
    })

    it('should cancel order successfully with many confirm request', async function () {
      const order = new OrderModel({
        name: 'test',
        price: 100,
        status: OrderStatus.CREATED,
      })
      await order.save()
      const orderId = order.id
      const res = await Promise.allSettled([
        axios.post(host + '/api/orders/confirm/' + orderId, {}),
        axios.post(host + '/api/orders/confirm/' + orderId, {}),
        axios.post(host + '/api/orders/confirm/' + orderId, {}),
        axios.post(host + '/api/orders/confirm/' + orderId, {}),
        axios.post(host + '/api/orders/confirm/' + orderId, {}),
        axios.post(host + '/api/orders/confirm/' + orderId, {}),
        axios.post(host + '/api/orders/confirm/' + orderId, {}),
        axios.post(host + '/api/orders/confirm/' + orderId, {}),
        axios.post(host + '/api/orders/confirm/' + orderId, {}),
        axios.post(host + '/api/orders/confirm/' + orderId, {}),
        axios.post(host + '/api/orders/cancel/' + orderId, {}),
      ])
      const result = res[res.length - 1]
      if (result.status === 'fulfilled')
        expect(result.value.data.result.status).to.equal(OrderStatus.CANCELED)
    })

    it('should cancel unsuccessfully due to order was already delivered', async function () {
      const order = new OrderModel({
        name: 'test',
        price: 100,
        status: OrderStatus.DELIVERDED,
      })
      await order.save()
      const orderId = order.id
      try {
        await axios.post(host + '/api/orders/cancel/' + orderId, {})
      } catch (err) {
        expect(err.response.data.message).to.equal(
          new ValidateException(
            `order ${orderId} already ${OrderStatus.DELIVERDED}`,
          ).message,
        )
      }
    })
  })

  it('should cancel unsuccessfully due to order was already canceled', async function () {
    const order = new OrderModel({
      name: 'test',
      price: 100,
      status: OrderStatus.CANCELED,
    })
    await order.save()
    const orderId = order.id
    try {
      await axios.post(host + '/api/orders/cancel/' + orderId, {})
    } catch (err) {
      expect(err.response.data.message).to.equal(
        new ValidateException(
          `order ${orderId} already ${OrderStatus.CANCELED}`,
        ).message,
      )
    }
  })

  it('should confirm successfully', async function () {
    const order = new OrderModel({
      name: 'test',
      price: 100,
      status: OrderStatus.CREATED,
    })
    await order.save()
    const orderId = order.id
    const { data } = await axios.post(
      host + '/api/orders/confirm/' + orderId,
      {},
    )
    expect(data.result.status).to.equal(OrderStatus.CONFIRMED)
  })

  it('should confirm unsuccessfully due to order was already confirm', async function () {
    const order = new OrderModel({
      name: 'test',
      price: 100,
      status: OrderStatus.CANCELED,
    })
    await order.save()
    const orderId = order.id
    try {
      await axios.post(host + '/api/orders/confirm/' + orderId, {})
    } catch (err) {
      expect(err.response.data.message).to.equal(
        new ValidateException(
          `order ${orderId} already ${OrderStatus.CANCELED}`,
        ).message,
      )
    }
  })
})
