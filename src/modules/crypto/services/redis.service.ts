import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private redisClient: Redis;
  constructor() {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10),
      password: process.env.REDIS_PASSWORD,
    });
  }

  async setPrice(symbol: string, price: number) {
    return await this.redisClient.set(symbol, price);
  }

  async getPrice(symbol: string) {
    return await this.redisClient.get(symbol);
  }
}
