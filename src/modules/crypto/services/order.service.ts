import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RedisService } from './redis.service';
import { OrderRepository } from '../models/repositories/order.repository';
import { OrderEntity } from '../models/entities/order.entity';
import { OrderStatusEnum } from '../enums/order.enum';
import { GetAllOrderDto } from '../dtos/get-all-order.dto';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';
import { applySortingToFindOptions } from 'src/common/factory/sort';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class OrderService {
  private btcPrice: number;
  private ethPrice: number;

  constructor(
    private readonly redisService: RedisService,
    private readonly orderRepository: OrderRepository,
    @Inject('ORDER_SERVICE') private readonly orderServiceClient: ClientProxy,
  ) {
    this.updatePrices();
    this.startOrderCreation();
    this.startOrderProcessing();
  }

  private async updatePrices() {
    this.btcPrice = await this.redisService.getPrice('BTC_USDT');
    this.ethPrice = await this.redisService.getPrice('ETH_USDT');
    // console.log('BTC Price:', this.btcPrice);
    setTimeout(() => this.updatePrices(), 1000);
  }

  async createOrder() {
    for (let i = 0; i < 100; i++) {
      const btcAmount = this.getRandomAmount();
      const ethAmount = this.getRandomAmount();
      const btcOrder = this.createOrderEntity(
        'BTC_USDT',
        this.btcPrice,
        btcAmount,
      );
      const ethOrder = this.createOrderEntity(
        'ETH_USDT',
        this.ethPrice,
        ethAmount,
      );

      await this.orderRepository.save(btcOrder);
      await this.orderRepository.save(ethOrder);
    }
  }

  private getRandomAmount(): number {
    return parseFloat((Math.random() * (0.1 - 0.001) + 0.001).toFixed(3));
  }

  private createOrderEntity(
    symbol: string,
    price: number,
    amount: number,
  ): OrderEntity {
    const order = new OrderEntity();
    order.symbol = symbol;
    order.price = price;
    order.amount = amount;
    order.total = price * amount;
    order.status = OrderStatusEnum.OPEN;
    return order;
  }

  private async startOrderProcessing() {
    setInterval(async () => {
      const orders = await this.orderRepository.find({
        select: {
          id: true,
          symbol: true,
          price: true,
          status: true,
        },
        where: { status: OrderStatusEnum.OPEN },
      });

      for (const order of orders) {
        await this.updateOrderStatus(order);
      }
    }, 1000);
  }

  private async updateOrderStatus(order: OrderEntity) {
    const currentPrice = await this.redisService.getPrice(order.symbol);

    if (currentPrice > order.price * 0.03 + order.price) {
      order.status = OrderStatusEnum.LIQUID;
      order.liquidPrice = currentPrice;
      const saveOrder = await this.orderRepository.save(order);

      this.orderServiceClient.emit<OrderEntity>('order_liquidated', saveOrder);
    }
  }

  private async startOrderCreation() {
    setInterval(() => this.createOrder(), 1000);
  }

  async getOrderById(id: number) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException('سفارش پیدا نشد');
    }
    return order;
  }

  async getAllOrders(query: GetAllOrderDto): Promise<[OrderEntity[], number]> {
    const { page, limit, status, symbol, sort, sortOrder } = query;

    const where: FindOptionsWhere<OrderEntity> = {};
    if (status) {
      where.status = status;
    }
    if (symbol) {
      where.symbol = symbol;
    }

    let findOptions: FindManyOptions<OrderEntity> = {
      where,
      take: limit,
      skip: (page - 1) * limit,
    };

    findOptions = applySortingToFindOptions(findOptions, sort, sortOrder);

    const [result, total] =
      await this.orderRepository.findAndCount(findOptions);

    return [result, total];
  }
}
