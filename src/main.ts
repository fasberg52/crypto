import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerHelper } from './common/utils/swagger.utils';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: '.env' });

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  await new SwaggerHelper().setup(app);

  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,

    options: {
      urls: [process.env.RMQ_URI],
      queue: 'queue_orders',
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.APP_PORT || 3004);
}

bootstrap();
