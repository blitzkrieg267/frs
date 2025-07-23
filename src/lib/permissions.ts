import { User } from "@/types/auth"

export function hasPermission(user: User | null, permission: string): boolean {
  if (!user) return false
  return user.permissions.includes(permission)
}
