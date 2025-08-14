import { useState, useCallback, useEffect } from 'react'
import { ChatWindowProps } from './ChatWindow.Types'

export const useChatWindow = ({peer, onSend}: ChatWindowProps) => {
    const [text, setText] = useState('')

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

    return {
        text,
        handleKeyDown,
        handleSend,
        handleSetText
    }
}