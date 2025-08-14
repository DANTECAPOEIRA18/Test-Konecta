export type User = { id: string; nick: string }
export type FileMeta = { url: string; name: string; mime: string; size: number }
export type Message = {
  from: string; to: string; content: string; timestamp: string;
  kind?: 'text' | 'file'; file?: FileMeta
}

export interface ChatWindowProps {
  meId: string
  peer: User | null
  messages: Message[]
  onSend: (text: string) => void
  onSendFile: (meta: FileMeta) => void
}