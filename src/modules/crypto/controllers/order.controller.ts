import { OrderService } from './../services/order.service';
import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetAllOrderDto } from '../dtos/get-all-order.dto';
import { OrderListResponse, OrderResponse } from '../responses/order.response';

@Controller('order')
@ApiTags('Order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('')
  @ApiOperation({ summary: 'get all orders with paginate' })
  @ApiOkResponse(OrderListResponse.getApiDoc())
  async getAllOrders(
    @Query() query: GetAllOrderDto,
  ): Promise<OrderListResponse> {
    const [result, total] = await this.orderService.getAllOrders(query);
    return new OrderListResponse(result, total);
  }

  @Get(':id')
  @ApiOperation({ summary: 'get order by id' })
  @ApiOkResponse(OrderResponse.getApiDoc())
  async getOrderById(@Query('id') id: number): Promise<OrderResponse> {
    const result = await this.orderService.getOrderById(id);
    return new OrderResponse(result);
  }
}
