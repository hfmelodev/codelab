'use client'

import { usePreferencesStore } from '@/stores/preferences'
import dynamic from 'next/dynamic'

const VideoPlayer = dynamic(() => import('./video-player'), {
  ssr: false,
})

type LessonPlayerProps = {
  lesson: CourseLesson
}

export function LessonPlayer({ lesson }: LessonPlayerProps) {
  // Aconselhavél buscar somente os dados que realmente serão usados para nao fazer requisicoes desnecessarias
  const autoPlay = usePreferencesStore(state => state.autoPlay)

  const videoId = lesson.videoId

  return (
    <div key={videoId} className="aspect-video w-full overflow-hidden bg-black">
      <VideoPlayer videoId={videoId} autoPlay={autoPlay} />
    </div>
  )
}
