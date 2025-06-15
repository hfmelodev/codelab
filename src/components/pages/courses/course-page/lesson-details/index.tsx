import { LessonComments } from './comments'
import { LessonPlayer } from './lesson-player'

type LessonDetailsProps = {
  lesson: CourseLesson
  nextLesson?: CourseLesson
}

export function LessonDetails({ lesson, nextLesson }: LessonDetailsProps) {
  return (
    <>
      {/* Lesson Player */}
      <LessonPlayer lesson={lesson} nextLesson={nextLesson} />

      <div className="flex flex-col gap-6 p-6">
        <p className="text-muted-foreground">{lesson.description}</p>

        {/* Lesson Comments */}
        <LessonComments />
      </div>
    </>
  )
}
