import { LessonPlayer } from './lesson-player'

type LessonDetailsProps = {
  lesson: CourseLesson
}

export function LessonDetails({ lesson }: LessonDetailsProps) {
  return (
    <>
      {/* Lesson Player */}
      <LessonPlayer lesson={lesson} />

      <div className="flex flex-col gap-6 p-6">
        <p className="text-muted-foreground">{lesson.description}</p>

        {/* Lesson Comments */}
      </div>
    </>
  )
}
