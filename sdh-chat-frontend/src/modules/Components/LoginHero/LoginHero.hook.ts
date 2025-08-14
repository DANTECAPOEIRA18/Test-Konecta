import { useState } from 'react'
import { LoginHeroProps } from './LoginHero.Types'

export const useLoginHero = ({onConfirm, heroUrl} : LoginHeroProps) => {
    const [nick, setNick] = useState('')
    const canSubmit = nick.trim().length >= 2

    const handleSetNick = (nickName:string) => {
        setNick(nickName);
    }

    const handleSubmit = () => {
        if (!canSubmit) return
        onConfirm(nick.trim())
    }

    const defaultHero = heroUrl || 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=1600&auto=format&fit=crop';

    return{
        nick,
        handleSetNick,
        handleSubmit,
        defaultHero,
        canSubmit
    }
}