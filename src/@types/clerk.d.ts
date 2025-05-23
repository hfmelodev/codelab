// biome-ignore lint/complexity/noUselessEmptyExport: <explanation>
export {}
export type Roles = 'admin' | 'member'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}
