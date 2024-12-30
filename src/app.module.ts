// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CryptoModule } from './modules/crypto/crypto.module';

@Module({
  imports: [CryptoModule],
})
export class AppModule {}
