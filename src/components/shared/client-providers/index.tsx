'use client'

import { queryClient } from '@/lib/tanstack-query'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors theme="dark" />
      {children}
    </QueryClientProvider>
  )
}
