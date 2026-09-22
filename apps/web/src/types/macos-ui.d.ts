/**
 * @sylonikse/macos-ui 0.2.0 ships no .d.ts files at all (same packaging bug
 * as its missing dist/styles — see src/styles/macos-theme.css). Hand-written
 * to match its published src/components/*.types.ts. Revisit if a fixed
 * version ships real declarations.
 */
declare module '@sylonikse/macos-ui' {
  import type { ComponentType, ReactNode } from 'react'

  export interface MenuItemConfig {
    label: string
    shortcut?: string
    onClick?: () => void
    disabled?: boolean
    divider?: boolean
    submenu?: MenuItemConfig[]
  }

  export interface MenuConfig {
    label: string
    items: MenuItemConfig[]
  }

  export interface MenuBarProps {
    logo?: ReactNode
    menus?: MenuConfig[]
    rightContent?: ReactNode
    className?: string
  }

  export const MenuBar: ComponentType<MenuBarProps>

  export interface DesktopIconProps {
    icon: ComponentType<{ size?: number; color?: string }>
    label: string
    color?: string
    onClick?: () => void
    onDoubleClick?: () => void
    selected?: boolean
    className?: string
  }

  export const DesktopIcon: ComponentType<DesktopIconProps>
}
