
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
onPrivateMessage(client: Socket, payload: Partial<Message>) {
  // Validación mínima
  if (!payload?.to) return

  // El servidor siempre fija el remitente y el timestamp
  const msg: Message = {
    from: client.id,
    to: String(payload.to),
    content: String(payload.content ?? ''),
    timestamp: new Date().toISOString(),
    // Soportar adjuntos
    kind: payload.kind ?? 'text',
    file: payload.file,
  }

  this.chat.pushMessage(msg)
  // Entregar al receptor
  this.server.to(msg.to).emit('private_message', msg)
  // Echo al emisor (mantiene consistencia UI)
  client.emit('private_message', msg)
}
}
