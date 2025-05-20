import { cn } from '@/lib/utils'
import Link from 'next/link'

import Logo from '@/assets/logo.svg'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main
      className={cn(
        'flex w-full flex-col items-center justify-center gap-10',
        'h-screen min-h-max px-6 py-10'
      )}
    >
      <Link href="/" className="block w-full max-w-[200px]">
        <Logo />
      </Link>

      {children}
    </main>
  )
}
