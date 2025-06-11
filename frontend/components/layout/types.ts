import { LinkProps } from '@tanstack/react-router'

interface User {
  name: string
  email: string
  avatar: string
}

interface Team {
  name: string
  logo: React.ElementType
  plan: string
}

interface BaseNavItem {
  title: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

interface NavLink extends BaseNavItem {
  url: string
}

interface NavCollapsible extends BaseNavItem {
  items?: NavLink[]
}

type NavItem = NavLink | NavCollapsible

interface NavGroup {
  title: string
  items: readonly NavItem[]
}

export type { NavGroup, NavItem, NavLink, NavCollapsible }

interface SidebarData {
  user: User
  teams: Team[]
  navGroups: NavGroup[]
}

export type { SidebarData } 