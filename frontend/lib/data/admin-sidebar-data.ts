import { Home, Users, FileCheck, Plus, FileText, BarChart, Shield, Settings } from 'lucide-react'
import type { NavGroup } from '@/components/layout/types'

export const adminSidebarData = {
  user: {
    name: 'Admin User',
    email: 'admin@example.com',
    avatar: '/avatar.png',
  },
  navGroups: [
    {
      title: 'Main',
      items: [
        {
          title: 'Dashboard',
          url: '/admin',
          icon: Home,
        },
        {
          title: 'Citizens',
          url: '/admin/citizens',
          icon: Users,
        },
        {
          title: 'NIDA',
          url: '/admin/nida',
          icon: FileCheck,
        },
        {
          title: 'Register Citizen',
          url: '/admin/citizens/register',
          icon: Plus,
        },
        {
          title: 'Register NIDA',
          url: '/admin/nida/register',
          icon: Plus,
        },
        {
          title: 'Documents',
          url: '/admin/documents',
          icon: FileText,
        },
        {
          title: 'Approve Documents',
          url: '/admin/documents/approve',
          icon: FileText,
        },
      ],
    },
  ],
} as const

export const superAdminSidebarData = {
  user: {
    name: 'Super Admin',
    email: 'superadmin@example.com',
    avatar: '/avatar.png',
  },
  navGroups: [
    {
      title: 'Main',
      items: [
        {
          title: 'Dashboard',
          url: '/admin',
          icon: Home,
        },
        {
          title: 'Users',
          url: '/admin/users',
          icon: Users,
        },
        {
          title: 'Documents',
          url: '/admin/documents',
          icon: FileText,
        },
        {
          title: 'Reports',
          url: '/admin/reports',
          icon: BarChart,
        },
        {
          title: 'Audit Logs',
          url: '/admin/audit',
          icon: Shield,
        },
        {
          title: 'Settings',
          url: '/admin/settings',
          icon: Settings,
        },
      ],
    },
  ],
} as const 