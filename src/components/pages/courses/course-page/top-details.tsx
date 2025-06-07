'use client'

import { BackButton } from '@/components/shared/back-button'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Tooltip } from '@/components/ui/tooltip'
import { usePreferencesStore } from '@/stores/preferences'
import { PanelRightOpen } from 'lucide-react'
import Link from 'next/link'

type TopDetailsProps = {
  course: Course
}

export function TopDetails({ course }: TopDetailsProps) {
  const { setModulesListCollapsed, autoPlay, setAutoPlay } = usePreferencesStore()

  return (
    <div className="sticky top-0 z-10 flex w-full items-center gap-4 border-border border-b bg-sidebar p-4 sm:gap-6 sm:p-6">
      <BackButton />

      <div className="flex items-center gap-2 text-xs sm:text-sm">
        <Link href={`/courses/details/${course.slug}`} className="line-clamp-1 font-semibold transition-all hover:text-primary">
          {course.title}
        </Link>

        <span className="text-muted-foreground">/</span>

        <p className="line-clamp-1 hidden sm:block">Título do módulo</p>

        <span className="hidden text-muted-foreground sm:block">/</span>

        <p className="line-clamp-1">Título da aula</p>
      </div>

      <div className="ml-auto flex items-center gap-4">
        {/* Switch de Autoplay */}
        <Tooltip content="Ativar autoplay">
          <div className="flex items-center gap-2">
            <span className="block text-xs sm:hidden">Autoplay</span>
            <Switch checked={autoPlay} onCheckedChange={setAutoPlay} />
          </div>
        </Tooltip>

        {/* Icone para abrir o painel de modulos no mobile */}
        <Button size="icon" variant="outline" onClick={() => setModulesListCollapsed(false)} className="flex sm:hidden">
          <PanelRightOpen />
        </Button>
      </div>
    </div>
  )
}
