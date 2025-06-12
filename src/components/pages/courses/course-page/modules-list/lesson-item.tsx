import { markLessonAsCompleted, unmarkLessonAsCompleted } from '@/actions/course-progress'
import { Tooltip } from '@/components/ui/tooltip'
import { queryKeys } from '@/constants/query-keys'
import { cn, formatDuration } from '@/lib/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CircleCheckBig, CircleX, Video } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

type LessonItemProps = {
  lesson: CourseLesson & {
    completed: boolean
  }
}

export function LessonItem({ lesson }: LessonItemProps) {
  const params = useParams()

  const queryClient = useQueryClient()

  const courseSlug = params.slug as string
  const currentLessonId = params.lessonId as string
  const completedLesson = lesson.completed

  const PrimaryIcon = completedLesson ? CircleCheckBig : Video
  const SecondaryIcon = completedLesson ? CircleX : CircleCheckBig

  const lessonId = lesson.id

  const { mutate: handleCompleteLesson, isPending: isCompletingLesson } = useMutation({
    mutationFn: () => markLessonAsCompleted({ courseSlug, lessonId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.courseProgress(courseSlug),
      })
    },
  })

  const { mutate: handleUnmarkLessonAsCompleted, isPending: isUnmarkingLessonAsCompleted } = useMutation({
    mutationFn: () => unmarkLessonAsCompleted(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.courseProgress(courseSlug),
      })
    },
  })

  const isLoading = isCompletingLesson || isUnmarkingLessonAsCompleted

  return (
    <Link
      href={`/courses/${courseSlug}/${lesson.moduleId}/lesson/${lesson.id}`}
      className={cn(
        'flex items-center gap-2 rounded-md p-2 text-muted-foreground text-sm transition-all hover:bg-muted/50',
        lesson.id === currentLessonId && 'text-white',
        completedLesson && 'text-primary'
      )}
    >
      <Tooltip content={completedLesson ? 'Marcar como não assistido' : 'Marcar como assistido'}>
        <button
          type="button"
          className="group/lesson-button relative size-4 min-w-4 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isLoading}
          onClick={event => {
            // Previne o comportamento padrão do link ao clicar no botão
            event.stopPropagation()
            event.preventDefault()

            if (completedLesson) {
              handleUnmarkLessonAsCompleted()

              return
            }

            handleCompleteLesson()
          }}
        >
          <PrimaryIcon className="h-full w-full opacity-100 transition-all group-hover/lesson-button:opacity-0" />
          <SecondaryIcon className="absolute inset-0 h-full w-full opacity-0 transition-all group-hover/lesson-button:opacity-100" />
        </button>
      </Tooltip>

      <p className="line-clamp-1">{lesson.title}</p>

      <p className="ml-auto text-muted-foreground text-xs">{formatDuration(lesson.durationInMs, true)}</p>
    </Link>
  )
}
