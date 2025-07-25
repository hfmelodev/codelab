import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'

import { cn } from '@/lib/utils'
import { ptBR } from '@clerk/localizations'
import { ClerkProvider } from '@clerk/nextjs'
import { setDefaultOptions } from 'date-fns'
import { ptBR as dateFnsPtBR } from 'date-fns/locale/pt-BR'

setDefaultOptions({ locale: dateFnsPtBR })

import { ClientProviders } from '@/components/shared/client-providers'
import '@/styles/clerk.css'
import '@/styles/globals.css'

const nunito = Nunito({
  variable: '--font-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'CodeLab',
  icons: {
    icon: '/logo-icon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: 'hsl(160 100% 37%)',
        },
      }}
      localization={ptBR}
    >
      <html lang="pt-BR" suppressHydrationWarning>
        <body className={cn(nunito.variable, 'dark font-sans antialiased')}>
          <ClientProviders>{children}</ClientProviders>
        </body>
      </html>
    </ClerkProvider>
  )
}
