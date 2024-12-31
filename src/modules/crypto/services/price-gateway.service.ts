import { RedisService } from './redis.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { OnGatewayInit, WebSocketGateway } from '@nestjs/websockets';
import Redis from 'ioredis';
import { Server } from 'socket.io';
import { API_GATEIO } from 'src/common/constants/api-gateio';
import WebSocket from 'ws';

@WebSocketGateway(3000, { transports: ['websocket'] })
@Injectable()
export class PriceGateWayService implements OnModuleInit, OnGatewayInit {
  constructor(private redisService: RedisService) {}
  private ws: WebSocket;

  onModuleInit() {
    console.log('geteway is initialized >>');

    this.initializeGateWebSocket();
  }

  afterInit(server: Server) {
    console.log('socket is initialized');
  }

  private initializeGateWebSocket() {
    this.ws = new WebSocket(API_GATEIO);
    this.ws.on('open', () => {
      console.log('connected to gate.io');
      this.ws.send(
        JSON.stringify({
          method: 'ticker.subscribe',
          params: ['BTC_USDT', 'ETH_USDT'],
          id: 1,
        }),
      );
    });

    this.ws.on('message', (data) => {
      this.handleWebSocketMessage(data.toString());
    });

    this.ws.on('error', (error) => {
      console.error('Error:', error);
    });

    this.ws.on('close', () => {
      console.log('connection closed...');
      setTimeout(() => this.initializeGateWebSocket(), 5000);
    });
  }

  private async handleWebSocketMessage(message: string) {
    try {
      const response = JSON.parse(message);
      if (response?.method === 'ticker.update' && response.params) {
        const [symbol, tickerData] = response.params;
        const { last: price } = tickerData;

        if (symbol && price) {
          await this.redisService.setPrice(symbol, price);
          console.log(`updated >>> ${symbol} price to ${price} in redis`);
        }
      }
    } catch (error) {
      console.error('error in handleWebSocketMessage:', error);
    }
  }
}
