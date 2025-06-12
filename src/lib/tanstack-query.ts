import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  // Desabilita o retry automático de requisições
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
})
