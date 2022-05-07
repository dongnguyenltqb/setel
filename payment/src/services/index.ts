import { PaymentService } from './payment'

export class ServiceContext {
  private static instance: ServiceContext

  private payment: PaymentService

  static getInstance(): ServiceContext {
    if (!ServiceContext.instance) {
      ServiceContext.instance = new ServiceContext()
    }
    return ServiceContext.instance
  }

  public setPaymentService(service: PaymentService): ServiceContext {
    this.payment = service
    return this
  }

  public getPaymentService(): PaymentService {
    return this.payment
  }
}
