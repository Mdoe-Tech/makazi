'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Badge } from '../ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { NavCollapsible, NavItem, NavLink, type NavGroup } from './types'
import { cn } from '@/lib/utils'

interface NavGroupProps {
  group: NavGroup
}

export function NavGroup({ group }: NavGroupProps) {
  const { state } = useSidebar()
  const pathname = usePathname()

  return (
    <SidebarGroup>
      {state === 'expanded' && <SidebarGroupLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">{group.title}</SidebarGroupLabel>}
      <SidebarMenu>
        {group.items.map((item) => {
          const key = `${item.title}-${('url' in item ? item.url : '')}`

          if ('url' in item && !('items' in item))
            return <SidebarMenuLink key={key} item={item as NavLink} href={pathname} />

          if (state === 'collapsed' && 'items' in item)
            return (
              <SidebarMenuCollapsedDropdown key={key} item={item as NavCollapsible} href={pathname} />
            )

          if ('items' in item)
            return <SidebarMenuCollapsible key={key} item={item as NavCollapsible} href={pathname} />

          return null
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

const NavBadge = ({ children }: { children: ReactNode }) => (
  <Badge className='rounded-full bg-blue-100 text-blue-700 px-1.5 py-0 text-xs dark:bg-blue-900 dark:text-blue-300'>{children}</Badge>
)

const SidebarMenuLink = ({ item, href }: { item: NavLink; href: string }) => {
  const { setOpenMobile, state } = useSidebar()
  const isActive = checkIsActive(href, item)
  
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.title}
        className={cn(
          'shadow-sm transition-colors',
          isActive 
            ? 'bg-slate-100 dark:bg-slate-800' 
            : 'bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800'
        )}
      >
        <Link href={item.url} onClick={() => setOpenMobile(false)} className="py-1.5">
          {item.icon && <item.icon className="size-4 text-slate-600 dark:text-slate-400" />}
          {state === 'expanded' && <span className="text-sm text-slate-700 dark:text-slate-300">{item.title}</span>}
          {state === 'expanded' && item.badge && <NavBadge>{item.badge}</NavBadge>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

const SidebarMenuCollapsible = ({
  item,
  href,
}: {
  item: NavCollapsible
  href: string
}) => {
  const { setOpenMobile, state } = useSidebar()
  const isActive = checkIsActive(href, item, true)
  
  return (
    <Collapsible
      asChild
      defaultOpen={isActive}
      className='group/collapsible'
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton 
            tooltip={item.title}
            className={cn(
              'shadow-sm transition-colors',
              isActive 
                ? 'bg-slate-100 dark:bg-slate-800' 
                : 'bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800'
            )}
          >
            <div className="py-1.5 flex items-center">
              {item.icon && <item.icon className="size-4 text-slate-600 dark:text-slate-400" />}
              {state === 'expanded' && <span className="text-sm text-slate-700 dark:text-slate-300">{item.title}</span>}
              {state === 'expanded' && item.badge && <NavBadge>{item.badge}</NavBadge>}
              {state === 'expanded' && <ChevronRight className='ml-auto size-4 text-slate-500 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />}
            </div>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className='CollapsibleContent'>
          <SidebarMenuSub>
            {item.items?.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  asChild
                  isActive={checkIsActive(href, subItem)}
                  className={cn(
                    'shadow-sm transition-colors',
                    checkIsActive(href, subItem)
                      ? 'bg-slate-100 dark:bg-slate-800' 
                      : 'bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800'
                  )}
                >
                  <Link href={subItem.url} onClick={() => setOpenMobile(false)} className="py-1.5">
                    {subItem.icon && <subItem.icon className="size-4 text-slate-600 dark:text-slate-400" />}
                    <span className="text-sm text-slate-700 dark:text-slate-300">{subItem.title}</span>
                    {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

const SidebarMenuCollapsedDropdown = ({
  item,
  href,
}: {
  item: NavCollapsible
  href: string
}) => {
  const isActive = checkIsActive(href, item)
  
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            isActive={isActive}
            className={cn(
              'shadow-sm transition-colors',
              isActive 
                ? 'bg-slate-100 dark:bg-slate-800' 
                : 'bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800'
            )}
          >
            <div className="py-1.5">
              {item.icon && <item.icon className="size-4 text-slate-600 dark:text-slate-400" />}
            </div>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='right' align='start' sideOffset={4} className="w-56">
          <DropdownMenuLabel className="text-sm text-slate-700 dark:text-slate-300">
            {item.title} {item.badge ? `(${item.badge})` : ''}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.items?.map((sub) => (
            <DropdownMenuItem key={`${sub.title}-${sub.url}`} asChild>
              <Link
                href={sub.url}
                className={cn(
                  'py-1.5 transition-colors',
                  checkIsActive(href, sub)
                    ? 'bg-slate-100 dark:bg-slate-800' 
                    : 'bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                {sub.icon && <sub.icon className="size-4 text-slate-600 dark:text-slate-400" />}
                <span className='max-w-52 text-wrap text-sm text-slate-700 dark:text-slate-300'>{sub.title}</span>
                {sub.badge && (
                  <span className='ml-auto text-xs text-slate-500 dark:text-slate-400'>{sub.badge}</span>
                )}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

function checkIsActive(href: string, item: NavItem, mainNav = false) {
  if ('url' in item) {
    return (
      href === item.url || // /endpint?search=param
      href.split('?')[0] === item.url || // endpoint
      (mainNav &&
        href.split('/')[1] !== '' &&
        href.split('/')[1] === item.url.split('/')[1])
    )
  }
  
  if ('items' in item && item.items) {
    return !!item.items.filter((i: NavLink) => i.url === href).length
  }
  
  return false
} 