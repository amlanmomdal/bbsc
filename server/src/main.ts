declare const process: any;

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';
import * as fs from 'fs';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Ensure uploads directory and subdirectories exist
  const baseUploadsDir = join(__dirname, '..', 'uploads');
  ['events', 'competitions', 'gallery', 'committee'].forEach((sub) => {
    const dir = join(baseUploadsDir, sub);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Serve static files from uploads folder at /uploads
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // Enable CORS for frontend & admin integration
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global API route prefix
  app.setGlobalPrefix('api');

  // Swagger API Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('Burul Blue Star Club (BBSC) REST API')
    .setDescription('Official API documentation for BBSC Public Website & Admin Panel modules (Committee, Events, Gallery, Competitions, Auth)')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const PORT = process.env.PORT || 5001;
  await app.listen(PORT);
  console.log(`🚀 BBSC NestJS Server running at http://localhost:${PORT}/api`);
  console.log(`📚 Swagger API Docs available at http://localhost:${PORT}/api/docs`);
}
bootstrap();
