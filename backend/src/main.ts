// In your main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    exposedHeaders: 'Content-Length,Content-Type',
    credentials: true,
  });
  const configService = app.get(ConfigService);
  console.log('Connecting to MongoDB at:', configService.get('MONGO_URI'));
  await app.listen(3000);
}
bootstrap();