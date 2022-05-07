import { OrderService } from './order'

export class ServiceContext {
  private static instance: ServiceContext

  private order: OrderService

  static getInstance(): ServiceContext {
    if (!ServiceContext.instance) {
      ServiceContext.instance = new ServiceContext()
    }
    return ServiceContext.instance
  }

  public setOrderService(service: OrderService): ServiceContext {
    this.order = service
    return this
  }

  public getOrderService(): OrderService {
    return this.order
  }
}
