'use client'

import { IconMenu } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'

interface TopNavProps extends React.HTMLAttributes<HTMLElement> {
  links: {
    title: string
    href: string
    isActive: boolean
    disabled?: boolean
  }[]
}

export function TopNav({ className, links, ...props }: TopNavProps) {
  return (
    <>
      <div className='md:hidden'>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button 
              size='icon' 
              variant='outline'
              className="text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800"
            >
              <IconMenu className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            side='bottom' 
            align='start'
            className="w-56 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
          >
            {links.map(({ title, href, isActive, disabled }) => (
              <DropdownMenuItem key={`${title}-${href}`} asChild>
                <Link
                  href={href}
                  className={cn(
                    "flex w-full items-center px-2 py-1.5 text-sm",
                    isActive 
                      ? "text-slate-900 dark:text-slate-50 bg-slate-100 dark:bg-slate-800" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                  aria-disabled={disabled}
                >
                  {title}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav
        className={cn(
          'hidden items-center space-x-4 md:flex lg:space-x-6',
          className
        )}
        {...props}
      >
        {links.map(({ title, href, isActive, disabled }) => (
          <Link
            key={`${title}-${href}`}
            href={href}
            aria-disabled={disabled}
            className={cn(
              "text-sm font-medium transition-colors",
              isActive 
                ? "text-slate-900 dark:text-slate-50" 
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
            )}
          >
            {title}
          </Link>
        ))}
      </nav>
    </>
  )
} 