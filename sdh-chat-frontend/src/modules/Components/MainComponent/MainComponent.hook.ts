import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { User, Message, backend } from './MainComponet.Types'

export const useMaincomponent = () => {
    
      const [me, setMe] = useState<User | null>(null)
      const [users, setUsers] = useState<User[]>([])
      const [selected, setSelected] = useState<User | null>(null)
      const [socket, setSocket] = useState<Socket | null>(null)
      const [messages, setMessages] = useState<Message[]>([])
    
      // Mantener referencia al chat seleccionado para usar dentro de listeners
      const selectedRef = useRef<string | null>(null)
      useEffect(() => {
        selectedRef.current = selected?.id ?? null
      }, [selected?.id])
    
      // Conexión Socket.IO cuando hay "me"
      useEffect(() => {
        if (!me) return
        const s = io(backend, { transports: ['websocket'], query: { nick: me.nick } })
        setSocket(s)
    
        // Lista de usuarios (preserva contadores previos)
        s.on('users', (list: User[]) => {
          setUsers((prev) => {
            const counts = new Map(prev.map((u) => [u.id, u.unreadCount || 0]))
            const filtered = list.filter((u) => u.id !== s.id)
            return filtered.map((u) => ({ ...u, unreadCount: counts.get(u.id) || 0 }))
          })
        })
    
        // Mensaje entrante (evita incrementar no leídos para mensajes propios)
        s.on('private_message', (msg: Message) => {
          setMessages((prev) => [...prev, msg])
    
          if (msg.from !== s.id) {
            const openWith = selectedRef.current
            if (!openWith || openWith !== msg.from) {
              setUsers((prev) =>
                prev.map((u) =>
                  u.id === msg.from ? { ...u, unreadCount: (u.unreadCount || 0) + 1 } : u,
                ),
              )
            }
          }
        })
    
        s.on('disconnect', () => {
          setUsers([])
        })
    
        return () => {
          s.disconnect()
        }
      }, [me?.nick])
    
      const handleConfirmNick = (nickFromForm: string) => {
        setMe({ id: '', nick: nickFromForm })
      }
    
      const startChat = (u: User) => {
        setSelected(u)
        // Resetear no leídos del usuario elegido
        setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, unreadCount: 0 } : x)))
      }
    
      // Enviar: NO agregamos localmente; dejamos que el servidor ecoe con timestamp uniforme
      const send = useCallback(
        (text: string) => {
          if (!socket || !selected) return
          socket.emit('private_message', { to: selected.id, content: text })
        },
        [socket, selected],
      )
    
      // Conversación activa (yo <-> seleccionado)
      const convo = useMemo(() => {
        const myId = socket?.id
        if (!myId || !selected) return []
        return messages.filter(
          (m) => (m.from === myId && m.to === selected.id) || (m.from === selected.id && m.to === myId),
        )
      }, [messages, selected, socket?.id])

      return {
        me,
        users,
        selected,
        socket,
        messages,
        selectedRef,
        handleConfirmNick,
        startChat,
        send,
        convo
      }
}