
import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { SendMessageDto } from './messages.dto'
import { ChatService } from './chat/chat.service'
import { Server } from 'socket.io'
import { ChatGateway } from './chat/chat.gateway'

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly chat: ChatService, private readonly gateway: ChatGateway) {}

  /**
   * Send a private message from "server" to a specific socket id.
   * This is useful for testing via Swagger UI.
   */
  @Post('send')
  async send(@Body() dto: SendMessageDto) {
    const msg = { from: 'server', to: dto.to, content: dto.content, timestamp: new Date().toISOString() }
    this.chat.pushMessage(msg as any)
    // emit through gateway's server instance if already bootstrapped
    if ((this.gateway as any).server) {
      ;(this.gateway as any).server.to(dto.to).emit('private_message', msg)
    }
    return { delivered: true, msg }
  }
}
