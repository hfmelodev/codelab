'use client'

import { queryClient } from '@/lib/tanstack-query'
import { QueryClientProvider } from '@tanstack/react-query'

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
