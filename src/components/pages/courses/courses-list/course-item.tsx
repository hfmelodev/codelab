import { Badge } from '@/components/ui/badge'
import { Bookmark } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type CourseItemProps = {
  course: CourseWithTagsAndModules
}

export function CourseItem({ course }: CourseItemProps) {
  return (
    <Link
      className="overflow-hidden rounded-lg border bg-card transition-all hover:border-primary"
      href={`/courses/details/${course.slug}`}
    >
      <Image
        src={course.thumbnail}
        alt={`Thumbnail do curso ${course.title}`}
        width={400}
        height={200}
        className="h-[160px] w-full object-cover"
      />

      <div className="flex flex-col gap-2 px-3 py-3.5">
        <h3 className="font-bold text-sm">{course.title}</h3>

        <div className="mask-r-from-80% flex gap-2 overflow-hidden">
          <Badge
            variant="outline"
            className="max-w-max gap-1 border-primary bg-primary/10 text-primary"
          >
            <Bookmark size={14} />
            {course.modules.length} Módulos
          </Badge>

          {course.tags.map(tag => (
            <Badge
              key={`${course.id}-${tag.id}`}
              variant="outline"
              className="max-w-max"
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  )
}
