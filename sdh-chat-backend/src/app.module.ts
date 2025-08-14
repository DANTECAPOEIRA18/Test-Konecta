
import { Module } from '@nestjs/common'
import { ChatGateway } from './chat/chat.gateway'
import { ChatService } from './chat/chat.service'
import { HealthController } from './health.controller'
import { UsersController } from './users.controller'
import { MessagesController } from './messages.controller'

@Module({
  imports: [],
  controllers: [HealthController, UsersController, MessagesController],
  providers: [ChatGateway, ChatService],
})
export class AppModule {}
