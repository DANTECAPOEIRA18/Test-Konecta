// src/main.ts
import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173'
  app.enableCors({ origin: corsOrigin })   // ✅ no external cors import

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  const config = new DocumentBuilder()
    .setTitle('SDH Chat API')
    .setDescription('HTTP endpoints and upload for the WebSocket chat')
    .setVersion('1.1.0')
    .addTag('files').addTag('users').addTag('messages').addTag('health')
    .build()
  const doc = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, doc)

  await app.listen(process.env.PORT || 3000)
}
bootstrap()
