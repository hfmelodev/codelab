'use client'

import { queryClient } from '@/lib/tanstack-query'
import { QueryClientProvider } from '@tanstack/react-query'
import { setDefaultOptions } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import { Toaster } from 'sonner'

setDefaultOptions({ locale: ptBR })

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors theme="dark" />
      {children}
    </QueryClientProvider>
  )
}
