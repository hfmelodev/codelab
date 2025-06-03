import { getCourse } from '@/actions/courses'
import { LessonDetails } from '@/components/pages/courses/course-page/lesson-details'
import { TopDetails } from '@/components/pages/courses/course-page/top-details'
import { notFound } from 'next/navigation'

type CoursePageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params

  const { course } = await getCourse(slug)

  if (!course) return notFound()

  return (
    <div className="grid h-screen w-full grid-cols-[1fr_auto] overflow-hidden">
      <div className="h-full w-full overflow-y-auto">
        <TopDetails course={course} />

        <LessonDetails lesson={course.modules[0].lessons[0]} />
      </div>
    </div>
  )
}
