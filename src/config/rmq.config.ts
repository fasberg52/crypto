export const RMQConfig = {
  uri: process.env.RMQ_URI || 'amqp://localhost',
  exchanges: {
    order: 'order_exchange',
    price: 'price_exchange',
  },
};
