import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Izinkan request dari Vue.js frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  });

  // Swagger / OpenAPI
  const config = new DocumentBuilder()
    .setTitle('Q&A Forum API')
    .setDescription('RESTful API untuk Simple Q&A Forum')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup(
    'api/docs',
    app,
    SwaggerModule.createDocument(app, config),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Server  : http://localhost:${port}`);
  console.log(`Swagger : http://localhost:${port}/api/docs`);
}

bootstrap();
