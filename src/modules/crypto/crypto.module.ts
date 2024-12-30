import { Module } from '@nestjs/common';
import { OrderRepository } from './model/repositories/order.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

const repositories = [OrderRepository];
@Module({
  imports: [TypeOrmModule.forFeature(repositories)],
  controllers: [],
  providers: [...repositories],
  exports: [],
})
export class CryptoModule {}
