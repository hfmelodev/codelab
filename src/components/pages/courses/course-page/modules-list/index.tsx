'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { usePreferencesStore } from '@/stores/preferences'
import * as Accordion from '@radix-ui/react-accordion'
import { PanelRightOpen } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { ModuleItem } from './module-item'

type ModulesListProps = {
  modules: CourseModuleWithLessons[]
}

export function ModulesList({ modules }: ModulesListProps) {
  const moduleId = modules[0].id

  const { expandedModule, setExpandedModule, modulesListCollapsed, setModulesListCollapsed } = usePreferencesStore()

  function handleToggleCollapse() {
    setModulesListCollapsed(!modulesListCollapsed)
  }

  const initialCollapsedIsSet = useRef(false)

  // Verifica se o estado de collapsed foi setado pelo usuário ou pela largura da tela
  useEffect(() => {
    if (initialCollapsedIsSet.current) return

    initialCollapsedIsSet.current = true

    setModulesListCollapsed(window.innerWidth < 768)
  }, [setModulesListCollapsed])

  return (
    <aside
      className={cn(
        'h-full overflow-y-auto overflow-x-hidden border-border border-l bg-sidebar p-4',
        'flex min-w-[380px] max-w-[380px] flex-col items-center transition-all',
        !modulesListCollapsed && 'fixed top-0 right-0 bottom-0 z-10 sm:relative',
        modulesListCollapsed && 'hidden w-18 min-w-18 max-w-18 sm:flex'
      )}
    >
      <button
        type="button"
        className={cn(
          'group outine-0 absolute top-0 bottom-0 left-0 z-10 flex w-4 cursor-e-resize justify-start',
          modulesListCollapsed && 'cursor-w-resize'
        )}
        onClick={handleToggleCollapse}
      >
        <div className="h-full w-0.5 transition-all group-hover:bg-sidebar-border" />
      </button>

      {modulesListCollapsed ? (
        <Button size="icon" variant="outline" onClick={handleToggleCollapse}>
          <PanelRightOpen />
        </Button>
      ) : (
        <>
          <Button size="icon" variant="outline" onClick={handleToggleCollapse} className="mb-4 flex w-full sm:hidden">
            Fechar módulos
          </Button>

          <Accordion.Root
            type="single"
            className="flex h-full w-full flex-col gap-3"
            collapsible
            defaultValue={moduleId}
            value={expandedModule ?? undefined}
            onValueChange={setExpandedModule}
          >
            {modules.map(courseModule => (
              <ModuleItem key={courseModule.id} data={courseModule} />
            ))}
          </Accordion.Root>
        </>
      )}
    </aside>
  )
}
