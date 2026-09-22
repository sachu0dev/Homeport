import { useCallback, useEffect, useState } from 'react'
import { defaultWallpaperId, wallpapers, type Wallpaper } from '@/lib/wallpapers'

const STORAGE_KEY = 'homeport:wallpaper'

function readStoredWallpaperId(): string {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored && wallpapers.some((w) => w.id === stored) ? stored : defaultWallpaperId
}

export function useWallpaper() {
  const [wallpaperId, setWallpaperIdState] = useState<string>(() => readStoredWallpaperId())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, wallpaperId)
  }, [wallpaperId])

  const setWallpaperId = useCallback((id: string) => setWallpaperIdState(id), [])

  const wallpaper: Wallpaper = wallpapers.find((w) => w.id === wallpaperId) ?? wallpapers[0]

  return { wallpaper, wallpaperId, setWallpaperId, wallpapers }
}
