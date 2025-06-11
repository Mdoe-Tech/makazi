'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface UserAvatarProps {
  name: string
  email: string
  className?: string
}

export function UserAvatar({ name, email, className }: UserAvatarProps) {
  // Generate initials from name
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()

  return (
    <Avatar className={className}>
      <AvatarImage 
        src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`} 
        alt={name} 
      />
      <AvatarFallback className="bg-primary text-primary-foreground">
        {initials}
      </AvatarFallback>
    </Avatar>
  )
} 