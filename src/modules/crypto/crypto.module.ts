import { Module } from '@nestjs/common';
import { OrderRepository } from './models/repositories/order.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './services/order.service';
import { RedisService } from './services/redis.service';
import { PriceGateWayService } from './services/price-gateway.service';
import { OrderController } from './controllers/order.controller';

const repositories = [OrderRepository];
@Module({
  imports: [TypeOrmModule.forFeature(repositories)],
  controllers: [OrderController],
  providers: [...repositories, OrderService, RedisService, PriceGateWayService],
  exports: [],
})
export class CryptoModule {}
