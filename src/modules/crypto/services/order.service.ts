import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';
import { OrderRepository } from '../models/repositories/order.repository';
import { OrderEntity } from '../models/entities/order.entity';
import { OrderStatusEnum } from '../enums/order.enum';
import { GetAllOrderDto } from '../dtos/get-all-order.dto';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';
import { applySortingToFindOptions } from 'src/common/factory/sort';

@Injectable()
export class OrderService {
  private btcPrice: number;
  private ethPrice: number;

  constructor(
    private readonly redisService: RedisService,
    private readonly orderRepository: OrderRepository,
  ) {
    this.updatePrices();
    this.startOrderCreation();
    this.startOrderProcessing();
  }

  private async updatePrices() {
    this.btcPrice = parseFloat(await this.redisService.getPrice('BTC_USDT'));
    this.ethPrice = parseFloat(await this.redisService.getPrice('ETH_USDT'));
    console.log('BTC Price:', this.btcPrice);
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
      console.log('BTC Order:', btcOrder);
      await this.orderRepository.save(btcOrder);
      await this.orderRepository.save(ethOrder);
    }
  }

  private getRandomAmount(): number {
    return Math.random() * (0.1 - 0.001) + 0.001;
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

  private async startOrderCreation() {
    setInterval(() => this.createOrder(), 100000);
  }

  private async startOrderProcessing() {
    setInterval(async () => {
      const orders = await this.orderRepository.find({
        where: { status: OrderStatusEnum.OPEN },
      });

      for (const order of orders) {
        const currentPrice =
          order.symbol === 'BTC_USDT' ? this.btcPrice : this.ethPrice;
        if (order.price * 0.97 > currentPrice) {
          order.status = OrderStatusEnum.LIQUID;
          await this.orderRepository.save(order);
        }
      }
    }, 100000);
  }

  async getOrderById(id: number) {
    return this.orderRepository.findById(id);
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
