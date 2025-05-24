import { getCourses } from '@/actions/courses'
import { CourseItem } from './course-item'

type CoursesListProps = {
  query: string
  tags: string | string[]
}

export async function CoursesList({ query, tags }: CoursesListProps) {
  await new Promise(resolve => setTimeout(resolve, 2000))
  const courses = await getCourses({ query, tags })

  return (
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {courses.map(course => (
        <CourseItem key={course.id} course={course} />
      ))}
    </section>
  )
}
