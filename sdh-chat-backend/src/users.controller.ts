
import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ChatService } from './chat/chat.service'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly chat: ChatService) {}

  @Get()
  list() {
    return this.chat.getUsers()
  }
}
