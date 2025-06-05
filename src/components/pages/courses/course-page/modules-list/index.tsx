import { cn } from '@/lib/utils'
import * as Accordion from '@radix-ui/react-accordion'
import { ModuleItem } from './module-item'

type ModulesListProps = {
  modules: CourseModuleWithLessons[]
}

export function ModulesList({ modules }: ModulesListProps) {
  return (
    <aside
      className={cn(
        'h-full overflow-y-auto overflow-x-hidden border-border border-l bg-sidebar p-4',
        'relative flex min-w-[380px] max-w-[380px] flex-col items-center transition-all'
      )}
    >
      <div className="group absolute top-0 bottom-0 left-0 z-10 flex w-4 cursor-e-resize justify-start">
        <div className="h-full w-0.5 transition-all group-hover:bg-sidebar-border" />
      </div>

      <Accordion.Root
        type="single"
        className="flex h-full w-full flex-col gap-3"
        collapsible
      >
        {modules.map(courseModule => (
          <ModuleItem key={courseModule.id} data={courseModule} />
        ))}
      </Accordion.Root>
    </aside>
  )
}
