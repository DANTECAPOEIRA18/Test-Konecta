
import { Injectable } from '@nestjs/common'
import { Message, User } from './chat.types'

@Injectable()
export class ChatService {
  private users = new Map<string, User>() // socketId -> user
  private history: Message[] = []

  private ensureUniqueNick(desired: string): string {
    const existing = new Set(Array.from(this.users.values()).map(u => u.nick.toLowerCase()))
    const base = desired.trim() || 'User'
    if (!existing.has(base.toLowerCase())) return base

    let i = 2
    while (existing.has(`${base} (${i})`.toLowerCase())) i++
    return `${base} (${i})`
  }


  addUser(id: string, nick: string) {
    const unique = this.ensureUniqueNick(nick)
    const u = { id, nick: unique }
    this.users.set(id, u)
    return u
  }

  removeUser(id: string) {
    this.users.delete(id)
  }

  getUsers(exceptId?: string): User[] {
    return [...this.users.values()].filter(u => u.id !== exceptId)
  }

  pushMessage(m: Message) {
    this.history.push(m)
  }

  getConversation(a: string, b: string): Message[] {
    return this.history.filter(m => (m.from === a && m.to === b) || (m.from === b && m.to === a))
  }
}
