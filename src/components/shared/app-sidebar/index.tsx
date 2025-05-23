import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import Link from 'next/link'

import LogoIcon from '@/assets/logo-icon.svg'
import Logo from '@/assets/logo.svg'
import { NavItems } from './nav-items'
import { NavUser } from './nav-user'

// Herda todas as tipagens do Sidebar e adiciona o collapsible manualmente
type AppSidebarProps = React.ComponentProps<typeof Sidebar>

export function AppSidebar({ ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="py-4">
        <Link href="/">
          {/* Se a sidebar estiver expandida, mostra o logo normal, se estiver fechada, mostra o logo icon */}
          <Logo className="mx-auto w-full max-w-[150px] pt-3 group-data-[state=expanded]:block sm:hidden" />
          <LogoIcon className="mx-auto hidden w-full max-w-[20px] pt-3 group-data-[state=collapsed]:block " />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* FIXME: Items de navegação customizados */}
        <NavItems />
      </SidebarContent>

      <SidebarFooter>
        {/* FIXME: Componente de rodapé customizado */}
        <NavUser />
      </SidebarFooter>

      {/* Componente de barra lateral que permite arrastar a sidebar para o lado */}
      <SidebarRail>{/* RAIL */}</SidebarRail>
    </Sidebar>
  )
}
