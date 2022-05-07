const config = {
  server_port: process.env.server_port,
  postgres_url: process.env.postgres_url,
  order_host: process.env.payment_host,
  payment_host: process.env.payment_host,
  deliver_time: Number(process.env.deliver_time),
}

export default config
