import { Button } from '@/components/ui/button'
import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar'
import { LogIn } from 'lucide-react'
import Link from 'next/link'

export function NavUser() {
  return (
    <SidebarMenu>
      <SidebarMenuItem className="p-2">
        {/* passHref => significa que o link vai ser aberto em uma nova aba fazendo referencia ao button */}
        <Link href="/auth/sign-in" passHref className="w-full">
          <Button size="sm" variant="outline" className="w-full">
            <LogIn />
            Entrar
          </Button>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
