import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerHelper } from './common/utils/swagger.utils';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('/api');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  await new SwaggerHelper().setup(app);

  await app.listen(3000);
}
bootstrap();
