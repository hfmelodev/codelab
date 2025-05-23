import type { Roles } from '@/@types/clerk'
import { auth } from '@clerk/nextjs/server'

// Verifica se o usuário atual tem o papel especificado
export async function checkRole(role: Roles) {
  const { sessionClaims } = await auth()

  return sessionClaims?.metadata.role === role
}
