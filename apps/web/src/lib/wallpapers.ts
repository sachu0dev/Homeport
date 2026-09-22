export interface Wallpaper {
  id: string
  name: string
  /** Public path to the image; falls back to `gradient` if missing or fails to load. */
  src?: string
  /** CSS `background` value used as the default look and as a fallback. */
  gradient: string
}

export const wallpapers: Wallpaper[] = [
  {
    id: 'sonoma-day',
    name: 'Sonoma Day',
    src: '/wallpapers/sonoma-day.jpg',
    gradient: 'linear-gradient(160deg, #4a7fc7 0%, #d98a5f 55%, #f4c98f 100%)',
  },
  {
    id: 'sonoma-night',
    name: 'Sonoma Night',
    src: '/wallpapers/sonoma-night.jpg',
    gradient: 'linear-gradient(160deg, #0b1130 0%, #1c2b5e 55%, #4a3f7a 100%)',
  },
  {
    id: 'sequoia',
    name: 'Sequoia',
    src: '/wallpapers/sequoia.jpg',
    gradient: 'linear-gradient(160deg, #1f3d2b 0%, #3c6e47 55%, #a9c98f 100%)',
  },
  {
    id: 'ventura',
    name: 'Ventura',
    src: '/wallpapers/ventura.jpg',
    gradient: 'linear-gradient(160deg, #d9622b 0%, #e8965a 55%, #f6d9a8 100%)',
  },
  {
    id: 'monterey',
    name: 'Monterey',
    src: '/wallpapers/monterey.jpg',
    gradient: 'linear-gradient(160deg, #2b5a8c 0%, #4f8fbf 55%, #9fd0e6 100%)',
  },
  {
    id: 'big-sur',
    name: 'Big Sur',
    src: '/wallpapers/big-sur.jpg',
    gradient: 'linear-gradient(160deg, #7a2f5e 0%, #c15b6f 55%, #f2a15f 100%)',
  },
]

export const defaultWallpaperId = wallpapers[0].id
