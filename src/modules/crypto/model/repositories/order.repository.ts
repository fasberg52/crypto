import { DataSource, Repository } from 'typeorm';
import { OrderEntity } from '../entities/order.entity';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrderRepository extends Repository<OrderEntity> {
  constructor(
    private configService: ConfigService,
    private dataSource: DataSource,
  ) {
    super(OrderEntity, dataSource.createEntityManager());
  }
}
