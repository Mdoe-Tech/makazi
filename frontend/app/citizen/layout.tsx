'use client'

import { cn } from '@/lib/utils'
import { SearchProvider } from '@/context/search-context'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { Header } from '@/components/layout/header'
import { TopNav } from '@/components/layout/top-nav'
import { useAuthStore } from '@/lib/store/auth.store'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, initialized, initialize } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const initAuth = async () => {
      if (!initialized) {
        await initialize()
      }
      setIsLoading(false)
    }
    
    initAuth()
  }, [initialized, initialize])
  
  useEffect(() => {
    if (!isLoading) {
      const isLoginPage = pathname?.includes('/login')
      if (!isLoginPage && !user) {
        router.push('/citizen/login')
      }
    }
  }, [isLoading, user, pathname, router])
  
  // Show nothing while loading
  if (isLoading) {
    return null
  }
  
  // Don't show layout for login page
  if (pathname?.includes('/login')) {
    return <>{children}</>
  }

  const navLinks = [
    {
      title: 'Dashboard',
      href: '/citizen/dashboard',
      isActive: pathname === '/citizen/dashboard',
    },
    {
      title: 'Documents',
      href: '/citizen/documents',
      isActive: pathname === '/citizen/documents',
    },
    {
      title: 'Profile',
      href: '/citizen/profile',
      isActive: pathname === '/citizen/profile',
    },
  ]
  
  return (
    <SearchProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <div className="fixed inset-y-0 left-0 z-50">
            <AppSidebar />
          </div>
          <div 
            className={cn(
              "flex-1 flex flex-col w-full transition-[margin] duration-300",
              "ml-[var(--sidebar-width)]",
              "peer-data-[state=collapsed]:ml-[var(--sidebar-width-icon)]"
            )}
          >
            <Header fixed>
              <TopNav links={navLinks} />
            </Header>
            <main className="flex-1 p-4 md:p-6 mt-16 w-full">
              <div className="w-full">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </SearchProvider>
  )
} 