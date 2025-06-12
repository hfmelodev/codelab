'use client'

import { markLessonAsCompleted } from '@/actions/course-progress'
import { queryKeys } from '@/constants/query-keys'
import { usePreferencesStore } from '@/stores/preferences'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import { useParams, useRouter } from 'next/navigation'

const VideoPlayer = dynamic(() => import('./video-player'), {
  ssr: false,
})

type LessonPlayerProps = {
  lesson: CourseLesson
  nextLesson?: CourseLesson
}

export function LessonPlayer({ lesson, nextLesson }: LessonPlayerProps) {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  // Aconselhavél buscar somente os dados que realmente serão usados para nao fazer requisicoes desnecessarias
  const autoPlay = usePreferencesStore(state => state.autoPlay)
  const setExpandedModule = usePreferencesStore(state => state.setExpandedModule)

  const videoId = lesson.videoId
  const courseSlug = params.slug as string

  const { mutateAsync: handleCompleteLesson } = useMutation({
    mutationFn: () => markLessonAsCompleted({ courseSlug, lessonId: lesson.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.courseProgress(courseSlug),
      })
    },
  })

  async function handleMoveToNextLesson() {
    await handleCompleteLesson()

    if (!autoPlay || !nextLesson) return

    if (nextLesson.moduleId !== lesson.moduleId) {
      setExpandedModule(nextLesson.moduleId)
    }

    router.push(`/courses/${courseSlug}/${nextLesson.moduleId}/lesson/${nextLesson.id}`)
  }

  return (
    <div key={videoId} className="aspect-video w-full overflow-hidden bg-black">
      <VideoPlayer videoId={videoId} autoPlay={autoPlay} onEnd={handleMoveToNextLesson} />
    </div>
  )
}
