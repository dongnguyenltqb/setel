import axios from 'axios'
import { IPaymentRequest } from '../interfaces/payment'
import logger from '../utils/logger'
import { Base } from './base'

type RandomResult = (orderId: number) => PaymentStatus

export enum PaymentStatus {
  CONFIRMED = 'confirmed',
  DECLINED = 'declined',
}

export class PaymentService extends Base {
  private randomFn: RandomResult
  constructor(random: RandomResult) {
    super()
    this.randomFn = random
  }
  public async process(request: IPaymentRequest): Promise<PaymentStatus> {
    const result = this.randomFn(request.order_id)
    logger.info('random result for order %s %s', request.order_id, result)
    if (result == PaymentStatus.CONFIRMED) {
      await this.confirmOrder(request.order_id, request.confirm_url)
      return PaymentStatus.CONFIRMED
    }
    await this.declineOrder(request.order_id, request.cancel_url)
    return PaymentStatus.DECLINED
  }
  private async confirmOrder(id: number, url: string): Promise<void> {
    try {
      await axios.post(url, {})
    } catch (err) {
      logger.error('error when confirm order %s %s', id, err.message)
    }
  }
  private async declineOrder(id: number, url: string): Promise<void> {
    try {
      await axios.post(url, {})
    } catch (err) {
      logger.error('error when decline order order %s %s', id, err.message)
    }
  }
}
