
export type User = { id: string; nick: string }
export type Message = {
  from: string
  to: string
  content: string
  timestamp: string
  kind?: 'text' | 'file'
  file?: FileMeta
}
export type FileMeta = { url: string; name: string; mime: string; size: number }