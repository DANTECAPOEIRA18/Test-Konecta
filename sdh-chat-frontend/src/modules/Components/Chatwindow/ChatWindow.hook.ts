import { useState, useCallback, useEffect, useRef } from 'react'
import { ChatWindowProps, FileMeta } from './ChatWindow.Types'

export const useChatWindow = ({peer, onSend, onSendFile, messages}: ChatWindowProps) => {
    const [text, setText] = useState('')
    const fileRef = useRef<HTMLInputElement | null>(null)

    // --- scroll helpers ---
    const bottomRef = useRef<HTMLDivElement | null>(null)
    const scrollToBottom = (behavior: ScrollBehavior = 'auto') =>
        bottomRef.current?.scrollIntoView({ behavior })
    
    useEffect(() => { scrollToBottom('auto') }, [peer?.id])
    useEffect(() => { scrollToBottom('smooth') }, [messages.length])

    // Limpia el input al cambiar de destinatario
    useEffect(() => {
        setText('')
    }, [peer?.id])

    const handleSetText = (textData: string) => {
        setText(textData);
    }

    const handleSend = useCallback(() => {
        if (!peer) return
        const t = text.trim()
        if (!t) return
        onSend(t)
        setText('')
    }, [peer, text, onSend])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
        }
    }

    const chooseFile = () => fileRef.current?.click()

    const uploadAndSend = async (file: File) => {
        if (!peer) return
        try {
        const fd = new FormData()
        fd.append('file', file)
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/files/upload`, { method: 'POST', body: fd })
        if (!res.ok) throw new Error(await res.text())
        const meta = (await res.json()) as FileMeta
        onSendFile(meta)
        } catch (e) {
        console.error(e)
        alert('Error uploading file')
        }
    }

    return {
        text,
        handleKeyDown,
        handleSend,
        handleSetText,
        chooseFile,
        uploadAndSend,
        fileRef,
        scrollToBottom,
        bottomRef
    }
}