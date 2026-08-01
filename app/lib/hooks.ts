'use client'

import { useCallback, useEffect, useState, type RefObject } from 'react'

/** Flips to true shortly after mount so CSS transitions can animate in. */
export function useMounted(delay = 50): boolean {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), delay)
    return () => clearTimeout(t)
  }, [delay])
  return mounted
}

/** Mirrors `value` after a short delay, driving enter animations. */
export function useDelayedValue<T>(value: T, initial: T, delay = 80): T {
  const [delayed, setDelayed] = useState(initial)
  useEffect(() => {
    const t = setTimeout(() => setDelayed(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return delayed
}

export function useEscapeKey(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onEscape() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [active, onEscape])
}

export function useClickOutside(ref: RefObject<HTMLElement | null>, active: boolean, onOutside: () => void) {
  useEffect(() => {
    if (!active) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, active, onOutside])
}

/** Local draft state kept in sync with a source of truth from context. */
export function useSyncedState<T>(source: T) {
  const [local, setLocal] = useState(source)
  useEffect(() => { setLocal(source) }, [source])
  return [local, setLocal] as const
}

/** Shared open/edit state for the add-meal modal. */
export function useMealModal<T>() {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<T | null>(null)

  const openAdd = useCallback(() => { setEditing(null); setOpen(true) }, [])
  const openEdit = useCallback((item: T) => { setEditing(item); setOpen(true) }, [])
  const close = useCallback(() => { setOpen(false); setEditing(null) }, [])

  return { open, editing, openAdd, openEdit, close }
}
