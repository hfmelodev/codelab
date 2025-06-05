import { cn, formatDuration } from '@/lib/utils'
import { CircleCheckBig, CircleX, Video } from 'lucide-react'
import Link from 'next/link'

type LessonItemProps = {
  lesson: CourseLesson
}

export function LessonItem({ lesson }: LessonItemProps) {
  const currentLessonId = 'cmb2baw4u003si3cogpnizt2c'
  const completedLesson = false

  const PrimaryIcon = completedLesson ? CircleCheckBig : Video
  const SecondaryIcon = completedLesson ? CircleX : CircleCheckBig

  return (
    <Link
      href={`/courses/course-slug/module-id/lesson/${lesson.id}`}
      className={cn(
        'flex items-center gap-2 rounded-md p-2 text-muted-foreground text-sm transition-all hover:bg-muted/50',
        lesson.id === currentLessonId && 'text-white',
        completedLesson && 'text-primary'
      )}
    >
      <button
        type="button"
        className="group/lesson-button relative size-4 min-w-4"
      >
        <PrimaryIcon className="h-full w-full opacity-100 transition-all group-hover/lesson-button:opacity-0" />
        <SecondaryIcon className="absolute inset-0 h-full w-full opacity-0 transition-all group-hover/lesson-button:opacity-100" />
      </button>

      <p className="line-clamp-1">{lesson.title}</p>

      <p className="ml-auto text-muted-foreground text-xs">
        {formatDuration(lesson.durationInMs, true)}
      </p>
    </Link>
  )
}
