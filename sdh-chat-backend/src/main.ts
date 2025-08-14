
import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cors from 'cors'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173'
  app.use(cors({ origin: corsOrigin }))

  // Global validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('SDH Chat API')
    .setDescription('HTTP endpoints that complement the WebSocket chat')
    .setVersion('1.0.0')
    .addTag('health')
    .addTag('users')
    .addTag('messages')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document) // => http://localhost:3000/api

  const port = process.env.PORT || 3000
  await app.listen(port as number)
  console.log(`Server listening on :${port} — Swagger at /api`)
}
bootstrap()
