import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'

import { cn } from '@/lib/utils'
import '@/styles/globals.css'

const nunito = Nunito({
  variable: '--font-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'CodeLab',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={cn(nunito.variable, 'dark font-sans antialiased')}>
        {children}
      </body>
    </html>
  )
}
