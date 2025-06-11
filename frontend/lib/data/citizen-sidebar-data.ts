import { Home, FileText, Settings, User } from 'lucide-react'
import { NavGroup } from '@/components/layout/types'
import { Building2 } from 'lucide-react'

export const citizenSidebarData = {
  teams: [
    {
      name: 'Citizen Portal',
      logo: Building2,
      plan: 'Citizen',
    },
  ],
  navGroups: [
    {
      title: 'Main',
      items: [
        {
          title: 'Dashboard',
          url: '/citizen/dashboard',
          icon: Home,
        },
        {
          title: 'My Documents',
          url: '/citizen/documents',
          icon: FileText,
        },
        {
          title: 'Profile',
          url: '/citizen/profile',
          icon: User,
        },
      ],
    },
  ],
  user: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '/avatar.png',
  },
} 