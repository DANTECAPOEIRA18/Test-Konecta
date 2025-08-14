export type User = { id: string; nick: string; unreadCount?: number }
export type Message = { from: string; to: string; content: string; timestamp: string }

export const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
export const getInitial = (name: string) => (name?.trim()?.charAt(0)?.toUpperCase() || '?')