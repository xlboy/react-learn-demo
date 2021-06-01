import { useState } from 'react'
import gameController from '.'
import { ActiveContent } from '../../typings/gameController'

function useAddRemoveActiveContent(
  activeContent: ActiveContent
): [symbol, () => void, (left: string, top: string) => void] {
  const activeContentTag = gameController.addActiveContent(activeContent)

  const removeActiveContent = () => {
    gameController.removeActiveContent(activeContentTag)
  }

  const updateActiveContentPosition = (left: string, top: string) => {
    gameController.updateActiveContentPosition(activeContentTag, { left, top })
  }
  return [activeContentTag, removeActiveContent, updateActiveContentPosition]
}

export default useAddRemoveActiveContent
