import { useState } from 'react'
import battlefieldCollideDetect, { ActiveContent } from '.'

function useAddRemoveActiveContent(activeContent: ActiveContent) {
  const [activeContentTag, setPlantTag] = useState<symbol | null>(() => {
    return battlefieldCollideDetect.addActiveContent(activeContent)
  })

  const removeActiveContent = () => {
    battlefieldCollideDetect.removeActiveContent(activeContentTag)
  }

  return [activeContentTag, removeActiveContent]
}

export default useAddRemoveActiveContent
