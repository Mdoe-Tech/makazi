'use client'

import { usePathname } from 'next/navigation'
import { Building2 } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { NavGroup } from '@/components/layout/nav-group'
import { NavUser } from '@/components/layout/nav-user'
import { useAuthStore } from '@/lib/store/auth.store'
import type { NavGroup as NavGroupType } from '@/components/layout/types'
import { adminSidebarData, superAdminSidebarData } from '@/lib/data/admin-sidebar-data'
import { citizenSidebarData } from '@/lib/data/citizen-sidebar-data'
import { UserRole } from '@/lib/api/auth/types'

export function AppSidebar() {
  const pathname = usePathname()
  const { user, initialized } = useAuthStore()
  
  // Get the appropriate sidebar data based on the current path and user role
  const getSidebarData = () => {
    if (user?.role === UserRole.SUPER_ADMIN) {
      return superAdminSidebarData;
    }
    if (user?.role === UserRole.ADMIN) {
      return adminSidebarData;
    }
    return citizenSidebarData;
  }

  const sidebarData = getSidebarData()
  
  // Create user data from auth store
  const userData = initialized && user ? {
    name: user.first_name && user.last_name 
      ? `${user.first_name} ${user.last_name}`
      : user.username || 'User',
    email: user.email || 'user@example.com',
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.first_name || user.username || 'User')}`,
  } : sidebarData.user

  return (
    <Sidebar 
      collapsible='icon'
      variant='floating'
      className="border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
    >
      <SidebarHeader className="border-b border-slate-200 px-2 py-2 dark:border-slate-800">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg'>
              <div className='bg-blue-600 text-white flex aspect-square size-8 items-center justify-center rounded-lg'>
                <Building2 className='size-4' />
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold text-slate-900 dark:text-slate-50'>
                  {pathname?.startsWith('/admin') ? 'Admin Portal' : 'Citizen Portal'}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="flex-1 overflow-auto">
        {sidebarData.navGroups.map((group) => (
          <NavGroup key={group.title} group={group} />
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-slate-200 px-2 py-2 dark:border-slate-800">
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
} 