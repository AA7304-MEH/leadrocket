import { useAuth } from '../contexts/AuthContext'

const ROLE_HIERARCHY = { admin: 3, manager: 2, member: 1 } as const

export function useRBAC() {
  const { user } = useAuth()

  function can(requiredRole: 'admin' | 'manager' | 'member'): boolean {
    if (!user) return false
    const userLevel = ROLE_HIERARCHY[user.role as keyof typeof ROLE_HIERARCHY] ?? 0
    const requiredLevel = ROLE_HIERARCHY[requiredRole] ?? 0
    return userLevel >= requiredLevel
  }

  return {
    isAdmin: user?.role === 'admin',
    isManager: can('manager'),
    isMember: !!user,
    can,
    role: user?.role ?? null,
  }
}
