import { DraggableScroll } from '@/components/shared/draggable-scroll'
import { prisma } from '@/lib/prisma'
import { TagsList } from './tag-item'

export async function CourseTagsList() {
  const tags = await prisma.courseTag.findMany()

  // Realiza a ordenação alfabeticamente dos tags
  const sortedTags = tags.sort((a, b) => a.name.localeCompare(b.name))

  return (
    <DraggableScroll className="scroll-hidden mask-r-from-80% flex w-full select-none gap-2 overflow-auto pr-28 outline-none">
      {sortedTags.map(tag => (
        <TagsList key={tag.id} tag={tag} />
      ))}
    </DraggableScroll>
  )
}
