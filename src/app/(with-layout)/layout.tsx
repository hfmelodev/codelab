import { AppSidebar } from '@/components/shared/app-sidebar'
import { SearchInput } from '@/components/shared/search-input'
import { Button } from '@/components/ui/button'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { LogIn } from 'lucide-react'
import Link from 'next/link'

type LayoutProps = {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      {/* FIXME: Componente de barra lateral customizado */}
      <AppSidebar />

      <SidebarInset>
        {/* FIXME: Componente de cabeçalho customizado */}
        <header className="flex h-[70px] shrink-0 items-center justify-between gap-2 border-b px-6">
          <div className="flex flex-1 items-center gap-4">
            {/* Removide o md:hidden */}
            <SidebarTrigger className="-ml-2 flex" />
            <SearchInput />
          </div>

          <Link href="/auth/sign-in">
            <Button size="sm">
              <LogIn />
              Entrar
            </Button>
          </Link>
        </header>

        {/* FIXME: Componente de conteúdo customizado */}
        <div className="flex flex-1 flex-col gap-6 overflow-auto p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
