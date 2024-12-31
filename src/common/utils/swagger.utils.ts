import { Buffer } from 'buffer';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config as dotenvConfig } from 'dotenv';
import { NestExpressApplication } from '@nestjs/platform-express';
import { UnauthorizedException } from '@nestjs/common';

dotenvConfig({ path: '.env' });

export class SwaggerHelper {
  private basePath = process.env.SWAGGER_PATH;
  private username = process.env.SWAGGER_USERNAME;
  private password = process.env.SWAGGER_PASSWORD;
  private title = process.env.SWAGGER_TITLE;
  private description = process.env.SWAGGER_DESCRIPTION;

  setup(app: any) {
    if (!this.basePath || !this.username || !this.password) {
      console.error('Swagger Disabled : configuration missing ...');
      return;
    }
    const config = new DocumentBuilder()
      .setTitle(this.title)
      .setDescription(this.description)
      .setVersion('1.0')
      .addBearerAuth()
      .addGlobalParameters({
        name: 'Accept-Language',
        in: 'header',
        schema: {
          enum: ['en', 'fa'],
        },
      })
      .build();
    app
      .getHttpAdapter()
      .getInstance()
      .use((request, reply, next) =>
        this.basicAuthInterceptor(request, reply, next),
      );
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(this.basePath, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        filter: true,
        operationsSorter: 'alpha',
      },
    });
  }

  getBasePath() {
    return this.basePath.startsWith('/') ? this.basePath : `/${this.basePath}`;
  }

  setError(reply: any, next: any) {
    reply.header('WWW-Authenticate', 'Basic realm="Paraf" charset="UTF-8"');
    next(new UnauthorizedException());
  }

  basicAuthInterceptor(request: any, reply: any, next: any) {
    const url = request.url.split('?').shift().replace(/\/+$/, '');
    if (url !== this.getBasePath() && url !== this.getBasePath() + '-json') {
      next();
      return;
    }
    let credentials = request.headers['authorization'];
    if (typeof credentials !== 'string') {
      this.setError(reply, next);
      return;
    }
    credentials = credentials.replace('Basic ', '');
    const credentialsDecoded = Buffer.from(credentials, 'base64').toString(
      'utf-8',
    );
    const userPassRE = /^([^:]*):(.*)$/;
    const userPass = userPassRE.exec(credentialsDecoded);
    if (userPass[1] === this.username && userPass[2] === this.password) {
      next();
      return;
    }
    this.setError(reply, next);
  }
}
