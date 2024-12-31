import { Module } from '@nestjs/common';
import { OrderRepository } from './models/repositories/order.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './services/order.service';
import { RedisService } from './services/redis.service';
import { PriceGateWayService } from './services/price-gateway.service';
import { OrderController } from './controllers/order.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrderListenerService } from './processing/oroder.process';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: '.env' });

const repositories = [OrderRepository];
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ORDER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_URI],
          queue: 'queue_orders',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    TypeOrmModule.forFeature([OrderRepository]),
  ],
  providers: [
    ...repositories,
    OrderService,
    RedisService,
    PriceGateWayService,
    OrderListenerService,
  ],
  controllers: [OrderController],
})
export class CryptoModule {}
