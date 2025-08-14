import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { ChatGateway } from './chat/chat.gateway'
import { ChatService } from './chat/chat.service'

// 👇 importa aquí tus controladores HTTP
import { HealthController } from './health.controller'
import { UsersController } from './users.controller'
import { MessagesController } from './messages.controller'
import { FilesController } from './files.controller'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), process.env.UPLOAD_DIR || 'uploads'),
      serveRoot: `/${process.env.UPLOAD_DIR || 'uploads'}`,
    }),
  ],
  controllers: [
    HealthController,
    UsersController,
    MessagesController,
    FilesController, // 👈 que no falte
  ],
  providers: [ChatGateway, ChatService],
})
export class AppModule {}