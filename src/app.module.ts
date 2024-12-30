// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CryptoModule } from './modules/crypto/crypto.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config as dotenvConfig } from 'dotenv';
import typeorm from './config/typeorm.config';
import { ResponseServerExeption } from './common/exceptions/catch.exeption';
import { APP_FILTER } from '@nestjs/core';
dotenvConfig({ path: '.env' });
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
      inject: [ConfigService],
    }),
    CryptoModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ResponseServerExeption,
    },
  ],
})
export class AppModule {}
