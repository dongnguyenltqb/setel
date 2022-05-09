import 'dotenv/config'
import config from './config'
import { deliverOrder } from './jobs/deliverOrder'
import Server from './server'
import logger from './utils/logger'

async function bootstrap() {
  try {
    await new Server(Number(config.server_port)).start()
    await deliverOrder()
  } catch (err) {
    logger.error(err)
  }
}

bootstrap()
