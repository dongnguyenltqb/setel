import {
  DataTypes,
  Model,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize'

import { DBConnection } from '../infra'
import { TableName } from './common'

export enum OrderStatus {
  CREATED = 'created',
  CONFIRMED = 'confirmed',
  CANCELED = 'canceled',
  DELIVERDED = 'delivered',
}

export class OrderModel extends Model<
  InferAttributes<OrderModel>,
  InferCreationAttributes<OrderModel>
> {
  declare id: CreationOptional<number>
  declare name: string
  declare price: number
  declare status: OrderStatus
  declare created_at: CreationOptional<Date>
  declare updated_at: CreationOptional<Date>
}

OrderModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        OrderStatus.CREATED,
        OrderStatus.CONFIRMED,
        OrderStatus.CANCELED,
        OrderStatus.DELIVERDED,
      ),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn('now'),
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn('now'),
    },
  },
  {
    sequelize: DBConnection.getInsance(),
    timestamps: false,
    tableName: TableName.ORDER,
    indexes: [
      {
        fields: ['status', 'updated_at'],
        using: 'BTREE',
      },
    ],
  },
)
