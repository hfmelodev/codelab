import { MediaPlayer, MediaProvider } from '@vidstack/react'
import {
  PlyrLayout,
  plyrLayoutIcons,
} from '@vidstack/react/player/layouts/plyr'

import '@vidstack/react/player/styles/base.css'
import '@vidstack/react/player/styles/plyr/theme.css'

type VideoPlayerProps = {
  videoId: string
  autoPlay: boolean
}

function VideoPlayer({ videoId, autoPlay }: VideoPlayerProps) {
  const userAlreadyInteracted = navigator.userActivation.hasBeenActive

  return (
    <MediaPlayer
      title="Vídeo da Aula"
      src={`youtube/${videoId}`}
      autoPlay={autoPlay && userAlreadyInteracted}
    >
      <MediaProvider />
      <PlyrLayout icons={plyrLayoutIcons} />
    </MediaPlayer>
  )
}

export default VideoPlayer
