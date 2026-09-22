export type DockAppKind = 'launchpad' | 'app' | 'trash'

export interface DockApp {
  id: string
  label: string
  /** Colorful glyph — see public/icons/LICENSE.md for credit. */
  iconSrc: string
  kind: DockAppKind
  /** Tailwind background classes for the icon tile — our own tile design. */
  tile: string
}

export const dockApps: DockApp[] = [
  {
    id: 'launchpad',
    label: 'Launchpad',
    iconSrc: '/icons/rocket.svg',
    kind: 'launchpad',
    tile: 'bg-gradient-to-b from-slate-600 to-slate-900',
  },
  {
    id: 'finder',
    label: 'Finder',
    iconSrc: '/icons/folder.svg',
    kind: 'app',
    tile: 'bg-gradient-to-b from-sky-400 to-blue-600',
  },
  {
    id: 'browser',
    label: 'Browser',
    iconSrc: '/icons/compass.svg',
    kind: 'app',
    tile: 'bg-gradient-to-b from-cyan-300 to-blue-500',
  },
  {
    id: 'messages',
    label: 'Messages',
    iconSrc: '/icons/messages.svg',
    kind: 'app',
    tile: 'bg-gradient-to-b from-emerald-400 to-green-600',
  },
  {
    id: 'mail',
    label: 'Mail',
    iconSrc: '/icons/mail.svg',
    kind: 'app',
    tile: 'bg-gradient-to-b from-blue-400 to-indigo-600',
  },
  {
    id: 'notes',
    label: 'Notes',
    iconSrc: '/icons/notes.svg',
    kind: 'app',
    tile: 'bg-gradient-to-b from-amber-300 to-yellow-500',
  },
  {
    id: 'photos',
    label: 'Photos',
    iconSrc: '/icons/photos.svg',
    kind: 'app',
    tile: 'bg-gradient-to-br from-pink-400 via-orange-400 to-purple-500',
  },
  {
    id: 'settings',
    label: 'Settings',
    iconSrc: '/icons/gear.svg',
    kind: 'app',
    tile: 'bg-gradient-to-b from-gray-400 to-gray-600',
  },
  {
    id: 'trash',
    label: 'Trash',
    iconSrc: '/icons/trash.svg',
    kind: 'trash',
    tile: 'bg-gradient-to-b from-gray-200 to-gray-400',
  },
]
