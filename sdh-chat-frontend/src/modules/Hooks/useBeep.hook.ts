import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// Pequeño beep sin archivos externos
export function useBeep() {
  const ctxRef = useRef<AudioContext | null>(null)

  const ensureCtx = () => {
    const AC: typeof AudioContext =
      (window as any).AudioContext || (window as any).webkitAudioContext
    ctxRef.current = ctxRef.current || new AC()
    return ctxRef.current
  }

  return useCallback((opts?: { volume?: number }) => {
    try {
      const ctx = ensureCtx()
      const now = ctx.currentTime
      const volume = Math.max(0, Math.min(opts?.volume ?? 0.06, 0.25)) // 0–0.25

      // helper para un "pop" con glide y envolvente corta
      const pop = (start: number, f0: number, f1: number, dur: number, gainMul: number) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(f0, now + start)
        osc.frequency.exponentialRampToValueAtTime(f1, now + start + dur)

        gain.gain.setValueAtTime(0, now + start)
        gain.gain.linearRampToValueAtTime(volume * gainMul, now + start + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(now + start)
        osc.stop(now + start + dur + 0.05)
      }

      // dos pops cortitos para dar sensación "burbuja"
      pop(0.0, 260, 520, 0.18, 1.0)
      pop(0.05, 180, 360, 0.16, 0.6)
    } catch {
      /* ignora si el navegador bloquea audio sin interacción previa */
    }
  }, [])
}