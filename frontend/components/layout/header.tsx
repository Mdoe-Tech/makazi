'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export const Header = ({
  className,
  fixed,
  children,
  ...props
}: HeaderProps) => {
  const [offset, setOffset] = React.useState(0)

  React.useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }
    document.addEventListener('scroll', onScroll, { passive: true })
    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'bg-white dark:bg-slate-950 flex h-16 items-center gap-3 p-4 sm:gap-4 border-b border-slate-200 dark:border-slate-800',
        fixed && 'header-fixed peer/header fixed z-50 w-full transition-[width] duration-300',
        offset > 10 && fixed ? 'shadow-sm' : 'shadow-none',
        className
      )}
      {...props}
    >
      <SidebarTrigger 
        variant='outline' 
        className='scale-125 sm:scale-100 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800' 
      />
      <Separator orientation='vertical' className='h-6 bg-slate-200 dark:bg-slate-800' />
      {children}
    </header>
  )
}

Header.displayName = 'Header' 