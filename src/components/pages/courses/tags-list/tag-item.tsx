'use client'

import { Badge } from '@/components/ui/badge'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import qs from 'query-string'
import type { CourseTag } from '../../../../../prisma/generated/prisma'

type TagItemProps = {
  tag: CourseTag
}

export function TagsList({ tag }: TagItemProps) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentIds = searchParams.getAll('tags')

  const isSelected = currentIds.includes(tag.id)

  function onSelectedTags() {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          tags: isSelected
            ? currentIds.filter(id => id !== tag.id)
            : [...currentIds, tag.id],
        },
      },
      { skipNull: true, skipEmptyString: true }
    )

    router.push(url)
  }

  return (
    <Badge
      variant={isSelected ? 'default' : 'outline'}
      className="cursor-pointer whitespace-nowrap hover:border-primary"
      onClick={onSelectedTags}
    >
      {tag.name}
    </Badge>
  )
}
