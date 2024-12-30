import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { BaseResponse, Pagination } from 'src/common/responses/base.response';
import { OrderEntity } from '../models/entities/order.entity';

@ApiExtraModels()
export class OrderResponse extends BaseResponse {
  @ApiProperty()
  result: OrderEntity;
  constructor(order: OrderEntity) {
    super();
    this.result = order;
  }
}

@ApiExtraModels()
export class OrderListResponse extends BaseResponse {
  @ApiProperty({ type: [OrderEntity] })
  result: OrderEntity[];

  @ApiProperty()
  pagination: Pagination;

  constructor(result: OrderEntity[], total: number) {
    super();
    this.result = result;
    this.pagination = Pagination.set({ total });
  }
}
