
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { ChatService } from './chat.service'
import { Message } from './chat.types'

@WebSocketGateway({
  cors: { origin: process.env.CORS_ORIGIN || 'http://localhost:5173' },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server
  constructor(private readonly chat: ChatService) {}

  handleConnection(client: Socket) {
    const desiredNick = (client.handshake.query.nick as string) || `User-${client.id.slice(0,5)}`
    const user = this.chat.addUser(client.id, desiredNick)

    client.emit('nick_assigned', { id: client.id, nick: user.nick })
    this.server.emit('users', this.chat.getUsers())
    client.emit('users', this.chat.getUsers(client.id))
  }

  handleDisconnect(client: Socket) {
    this.chat.removeUser(client.id)
    this.server.emit('users', this.chat.getUsers())
  }

  @SubscribeMessage('private_message')
  onPrivateMessage(client: Socket, payload: Message) {
    // enforce server timestamp for consistency
    const msg = { ...payload, from: client.id, timestamp: new Date().toISOString() }
    this.chat.pushMessage(msg)
    // send to recipient
    this.server.to(msg.to).emit('private_message', msg)
    // echo to sender (client already adds locally, but this keeps consistency if desired)
    client.emit('private_message', msg)
  }
}
