import { CoursesList } from '@/components/pages/courses/courses-list'
import { CourseTagsList } from '@/components/pages/courses/tags-list'
import { Skeleton } from '@/components/ui/skeleton'
import { Suspense } from 'react'

type CoursesPagesProps = {
  searchParams: Promise<{
    query: string
    tags: string | string[]
  }>
}

export default async function CoursesPages({
  searchParams,
}: CoursesPagesProps) {
  const { query, tags } = await searchParams

  const suspenseKey = JSON.stringify({ query, tags })

  return (
    <>
      <Suspense
        key={`${suspenseKey}-tags`}
        fallback={<Skeleton className="h-[22px] min-h-[22px] w-full" />}
      >
        <CourseTagsList />
      </Suspense>

      <Suspense key={suspenseKey} fallback={<Skeleton className="flex-1" />}>
        <CoursesList query={query} tags={tags} />
      </Suspense>
    </>
  )
}
