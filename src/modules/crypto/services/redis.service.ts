import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private redisClient: Redis;
  private readonly logger = new Logger(RedisService.name);
  private readonly prefix = process.env.REDIS_PREFIX;
  constructor() {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10),
      password: process.env.REDIS_PASSWORD,
    });
  }

  async setPrice(symbol: string, price: number) {
    const key = this.getPrefixedKey(symbol);
    const priceData = {
      symbol,
      price,
      timestamp: new Date().toISOString(),
    };
    return await this.redisClient.set(key, JSON.stringify(priceData));
  }

  async getPrice(symbol: string) {
    const key = this.getPrefixedKey(symbol);
    const price = await this.redisClient.get(key);
    const priceData = JSON.parse(price);
    return priceData?.price ?? 0;
  }

  private getPrefixedKey(key: string): string {
    return `${this.prefix}:${key}`;
  }
}
