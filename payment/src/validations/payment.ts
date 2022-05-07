const paymentRequestSchema = {
  body: {
    type: 'object',
    properties: {
      order_id: {
        type: 'integer',
      },
      confirm_url: {
        type: 'string',
      },
      cancel_url: {
        type: 'string',
      },
    },
    required: ['order_id', 'confirm_url', 'cancel_url'],
  },
} as const

export { paymentRequestSchema }
