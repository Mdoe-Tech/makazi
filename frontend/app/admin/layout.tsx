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
import { UserRole } from '@/lib/api/auth/types'

export default function AdminLayout({
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
    if (!isLoading && !user) {
      const isLoginPage = pathname?.includes('/admin/login');
      if (!isLoginPage) {
        router.push('/admin/login');
      }
    } else if (!isLoading && user && !user.roles?.includes(UserRole.ADMIN) && !user.roles?.includes(UserRole.SUPER_ADMIN)) {
      // Redirect if user is not an admin
      router.push('/');
    }
  }, [isLoading, user, router, pathname]);
  
  // Show nothing while loading
  if (isLoading) {
    return null
  }
  
  // Don't show layout for login page or superadmin page
  if (pathname?.includes('/login') || pathname?.includes('/superadmin')) {
    return <>{children}</>
  }

  // Get navigation links based on user role
  const getNavLinks = () => {
    if (user?.roles?.includes(UserRole.SUPER_ADMIN)) {
      return [
        {
          title: 'Dashboard',
          href: '/admin',
          isActive: pathname === '/admin',
        },
        {
          title: 'Users',
          href: '/admin/users',
          isActive: pathname === '/admin/users',
        },
        {
          title: 'Documents',
          href: '/admin/documents',
          isActive: pathname === '/admin/documents',
        },
        {
          title: 'Reports',
          href: '/admin/reports',
          isActive: pathname === '/admin/reports',
        },
        {
          title: 'Audit Logs',
          href: '/admin/audit',
          isActive: pathname === '/admin/audit',
        },
        {
          title: 'Settings',
          href: '/admin/settings',
          isActive: pathname === '/admin/settings',
        },
      ]
    }

    // Regular admin navigation
    if (user?.roles?.includes(UserRole.ADMIN)) {
      return [
        {
          title: 'Dashboard',
          href: '/admin',
          isActive: pathname === '/admin',
        },
        {
          title: 'Citizens',
          href: '/admin/citizens',
          isActive: pathname === '/admin/citizens',
        },
        {
          title: 'NIDA',
          href: '/admin/nida',
          isActive: pathname === '/admin/nida',
        },
        {
          title: 'Register Citizen',
          href: '/admin/citizens/register',
          isActive: pathname === '/admin/citizens/register',
        },
        {
          title: 'Register NIDA',
          href: '/admin/nida/register',
          isActive: pathname === '/admin/nida/register',
        },
        {
          title: 'Documents',
          href: '/admin/documents',
          isActive: pathname === '/admin/documents',
        },
        {
          title: 'Approve Documents',
          href: '/admin/documents/approve',
          isActive: pathname === '/admin/documents/approve',
        },
      ]
    }
    
    // Default return empty array if role doesn't match
    return []
  }
  
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
              <TopNav links={getNavLinks()} />
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