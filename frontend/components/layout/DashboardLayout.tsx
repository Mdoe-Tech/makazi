'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import { 
  Home, 
  Users, 
  FileText, 
  Settings,
  Bell,
  BarChart,
  Shield,
  LogOut,
  Menu,
  X,
  Star,
  Plus,
  HelpCircle,
  Moon,
  Sun,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { colors } from '@/lib/theme/colors';
import { Avatar } from '@/components/ui/avatar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userType: 'admin' | 'citizen';
}

type AdminRole = 'SUPER_ADMIN' | 'REGIONAL_ADMIN' | 'DISTRICT_ADMIN' | 'WARD_ADMIN' | 'OFFICE_ADMIN' | 'REGISTRAR' | 'VERIFIER' | 'APPROVER' | 'VIEWER';

export default function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout } = useAuthStore();

  // Handle dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  const getSwahiliGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Habari za asubuhi';
    if (hour < 18) return 'Habari za mchana';
    return 'Habari za jioni';
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/citizen/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    setMounted(true);
    // Check system preference
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(isDark);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDarkMode, mounted]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getRoleBasedNavigation = (userRole: AdminRole) => {
    const baseNavigation = [
      { name: 'Dashboard', href: '/admin', icon: Home },
    ];

    const rolePermissions: Record<AdminRole, typeof baseNavigation> = {
      SUPER_ADMIN: [
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Citizens', href: '/admin/citizens', icon: Users },
        { name: 'Documents', href: '/admin/documents', icon: FileText },
        { name: 'Reports', href: '/admin/reports', icon: BarChart },
        { name: 'Audit Logs', href: '/admin/audit', icon: Shield },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
      ],
      REGIONAL_ADMIN: [
        { name: 'Citizens', href: '/admin/citizens', icon: Users },
        { name: 'Documents', href: '/admin/documents', icon: FileText },
        { name: 'Reports', href: '/admin/reports', icon: BarChart },
      ],
      DISTRICT_ADMIN: [
        { name: 'Citizens', href: '/admin/citizens', icon: Users },
        { name: 'Documents', href: '/admin/documents', icon: FileText },
      ],
      WARD_ADMIN: [
        { name: 'Citizens', href: '/admin/citizens', icon: Users },
        { name: 'Documents', href: '/admin/documents', icon: FileText },
      ],
      OFFICE_ADMIN: [
        { name: 'Citizens', href: '/admin/citizens', icon: Users },
        { name: 'Documents', href: '/admin/documents', icon: FileText },
      ],
      REGISTRAR: [
        { name: 'Citizens', href: '/admin/citizens', icon: Users },
        { name: 'Register Citizen', href: '/citizen/register', icon: Plus },
        { name: 'Register NIDA', href: '/nida/register', icon: Plus },
        { name: 'Documents', href: '/admin/documents', icon: FileText },
      ],
      VERIFIER: [
        { name: 'Documents', href: '/admin/documents', icon: FileText },
      ],
      APPROVER: [
        { name: 'Documents', href: '/admin/documents', icon: FileText },
      ],
      VIEWER: [
        { name: 'Citizens', href: '/admin/citizens', icon: Users },
        { name: 'Documents', href: '/admin/documents', icon: FileText },
      ],
    };

    return [...baseNavigation, ...(rolePermissions[userRole] || [])];
  };

  const getCitizenNavigation = () => [
    { name: 'Dashboard', href: '/citizen', icon: Home },
    { name: 'My Documents', href: '/citizen/documents', icon: FileText },
    { name: 'My Profile', href: '/citizen/profile', icon: Users },
    { name: 'Settings', href: '/citizen/settings', icon: Settings },
  ];

  const navigation = userType === 'admin' 
    ? getRoleBasedNavigation((user?.role || 'VIEWER') as AdminRole)
    : getCitizenNavigation();

  const isActive = (path: string) => pathname === path;

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${mounted && isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCompact ? 'w-16' : 'w-56'}`}
      >
        <div className="flex flex-col h-full backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 border-r border-gray-200/50 dark:border-gray-700/50">
          {/* Logo */}
          <div className="flex flex-col p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {!isCompact && (
                  <div className="flex items-center">
                    <span className="text-xl font-bold bg-gradient-to-r from-primary-main to-primary-dark bg-clip-text text-transparent">
                      Makazi
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 lg:hidden"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 px-2 py-3 space-y-1.5 overflow-y-auto">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                  isActive(item.href)
                    ? 'bg-primary-main/10 text-primary-main dark:bg-primary-main/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                }`}
              >
                <div className={`absolute inset-0 rounded-lg transition-opacity duration-200 ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-primary-main/5 to-primary-main/10 dark:from-primary-main/10 dark:to-primary-main/20'
                    : 'group-hover:bg-gradient-to-r group-hover:from-primary-main/5 group-hover:to-primary-main/10 dark:group-hover:from-primary-main/10 dark:group-hover:to-primary-main/20'
                }`} />
                <item.icon className={`w-4.5 h-4.5 transition-transform duration-200 ${
                  isActive(item.href)
                    ? 'text-primary-main'
                    : 'text-gray-500 dark:text-gray-400 group-hover:text-primary-main'
                }`} />
                {!isCompact && (
                  <span className="ml-3 font-medium text-sm">{item.name}</span>
                )}
                {isActive(item.href) && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-main rounded-r-full" />
                )}
              </a>
            ))}
          </nav>

          {/* Quick Actions */}
          {!isCompact && (
            <div className="px-2 py-3 border-t border-gray-200/50 dark:border-gray-700/50">
              <button className="w-full flex items-center justify-center px-3 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-dark transition-colors duration-200">
                <Plus className="w-4 h-4 mr-1.5" />
                <span className="text-sm">New Document</span>
              </button>
            </div>
          )}

          {/* User Profile and Controls */}
          <div className="p-3 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar username={user?.username || 'User'} size="sm" className="ring-2 ring-primary-main/20" />
                {!isCompact && (
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.username}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className={`p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200 ${
                  isCompact ? 'ml-auto' : ''
                }`}
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isCompact ? 'lg:pl-16' : 'lg:pl-56'}`}>
        {/* Top Navigation */}
        <div className="sticky top-0 z-40 flex items-center justify-between h-16 px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsCompact(!isCompact)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
            >
              {isCompact ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {userType === 'admin' ? 'Jopo la Usimamizi' : 'Jopo la Mwananchi'}
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200">
              <HelpCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Welcome Banner */}
        <div className="relative overflow-hidden bg-white p-4 rounded-lg mx-6 mt-4 shadow-lg">
          <div className="relative flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {getSwahiliGreeting()}, {user?.first_name} {user?.last_name}!
              </h1>
              <p className="text-gray-600 text-sm">
                NIDA: {user?.username}
              </p>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1.5 bg-primary-main hover:bg-primary-dark text-white rounded-lg transition-colors duration-200 flex items-center text-sm">
                <Plus className="w-4 h-4 mr-1.5" />
                {userType === 'admin' ? 'Ongeza Mwananchi' : 'Omba Huduma'}
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 