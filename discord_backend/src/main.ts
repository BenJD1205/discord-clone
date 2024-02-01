import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
    allowedHeaders: [
      'Accept',
      'Authorization',
      'Content-Type',
      'X-Requested-With',
      'apollo-require-preflight',
    ],
  });
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1 }));
  await app.listen(3000);
}
bootstrap();
