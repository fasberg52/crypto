import { Injectable } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Injectable()
export class OrderListenerService {
  @EventPattern('order_liquidated')
  handleOrderLiquidated(data: any): void {
    console.log('Order liquidated:', data);
  }
}
