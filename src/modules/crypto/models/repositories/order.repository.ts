import { DataSource, Repository } from 'typeorm';
import { OrderEntity } from '../entities/order.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderRepository extends Repository<OrderEntity> {
  constructor(private dataSource: DataSource) {
    super(OrderEntity, dataSource.createEntityManager());
  }

  async findById(id: number): Promise<OrderEntity> {
    return this.findOneBy({ id });
  }
}
