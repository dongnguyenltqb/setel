const getOrderSchema = {
  params: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
      },
    },
    required: ['id'],
  },
} as const

const confirmOrderSchema = {
  params: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
      },
    },
    required: ['id'],
  },
} as const

const cancelOrderSchema = {
  params: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
      },
    },
    required: ['id'],
  },
} as const

const createOrderSchema = {
  body: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 1,
      },
      price: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['name', 'price'],
    additionalProperties: false,
  },
} as const

export {
  getOrderSchema,
  cancelOrderSchema,
  createOrderSchema,
  confirmOrderSchema,
}
