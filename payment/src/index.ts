import 'dotenv/config'
import config from './config'
import Server from './server'
import logger from './utils/logger'

async function bootstrap() {
  try {
    await new Server(Number(config.server_port)).start()
  } catch (err) {
    logger.error(err)
  }
}

bootstrap()
