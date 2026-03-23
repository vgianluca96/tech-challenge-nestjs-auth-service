import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for cross-service communication
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Enable validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Auth microservice port
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log('Auth Microservice is running on: http://localhost:' + port);
}
bootstrap();
