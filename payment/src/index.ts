import 'dotenv/config'
import config from './config'
import Server from './server'
import logger from './utils/logger'
new Server(Number(config.server_port)).start().catch((err) => logger.error(err))
