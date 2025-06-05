import { CircularProgress } from '@/components/shared/circular-progress'
import { cn, formatDuration } from '@/lib/utils'
import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { LessonItem } from './lesson-item'

type ModuleItemProps = {
  data: CourseModuleWithLessons
}

export function ModuleItem({ data }: ModuleItemProps) {
  const totalLessons = data.lessons.length
  const totalDuration = data.lessons.reduce((acc, lesson) => {
    return acc + lesson.durationInMs
  }, 0)

  const formattedDuration = formatDuration(totalDuration)

  const moduleProgress = 100

  return (
    <Accordion.Item
      value={data.id}
      className="group rounded-lg border border-border"
    >
      <Accordion.Trigger className="flex w-full items-center gap-4 p-4 outline-none transition-all hover:bg-muted/50">
        <div
          className={cn(
            'relative flex h-10 w-10 min-w-10 items-center justify-center rounded-full bg-black/70 font-semibold transition-all',
            moduleProgress >= 100 && 'bg-primary/10 text-primary'
          )}
        >
          {data.order}
          <CircularProgress
            progress={moduleProgress}
            className="absolute inset-0 h-full w-full"
          />
        </div>

        <div className="flex flex-1 flex-col gap-0.5 text-left text-muted-foreground">
          <p className="font-medium text-white/80">{data.title}</p>

          <div className="flex items-center gap-2 text-xs">
            <span>
              {totalLessons} aula{totalLessons > 1 && 's'}
            </span>

            <span>{formattedDuration}</span>
          </div>
        </div>

        <ChevronDown className="ml-auto size-4 text-muted-foreground transition-all group-data-[state=open]:rotate-180" />
      </Accordion.Trigger>

      <Accordion.Content className="overflow-hidden data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
        <div className="flex flex-col p-2">
          {data.lessons.map(lesson => (
            <LessonItem key={lesson.id} lesson={lesson} />
          ))}
        </div>
      </Accordion.Content>
    </Accordion.Item>
  )
}
