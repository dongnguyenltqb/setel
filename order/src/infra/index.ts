import { Sequelize } from 'sequelize'
import config from '../config'

export class DBConnection {
  private static sequelize: Sequelize
  public static connect() {
    DBConnection.sequelize = new Sequelize(config.postgres_url, {
      dialect: 'postgres',
    })
  }

  public static getInsance(): Sequelize {
    if (!this.sequelize) {
      DBConnection.connect()
    }
    return this.sequelize
  }
}
