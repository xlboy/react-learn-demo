import { MouseEventHandler, MouseEvent } from 'react'

type OnMoveEvent = MouseEventHandler<HTMLDivElement>
interface CoreEventHandle {
  onMouseDown: OnMoveEvent
  onMouseMove: OnMoveEvent
  onMouseUp: OnMoveEvent
}

function useMoveHook(): CoreEventHandle {
  const coreEventHandle: CoreEventHandle = (() => {
    let isDown = false
    let currentLeft = 0,
      currentTop = 0,
      clickLeft = 0,
      clickTop = 0

    function onMouseDown(ev: MouseEvent): void {
      isDown = true
      const el = ev.target as HTMLDivElement
      const { left, top } = el.style
      currentLeft = left ? parseInt(left) : 0
      currentTop = top ? parseInt(top) : 0
      clickLeft = ev.clientX
      clickTop = ev.clientY
    }

    function onMouseMove(ev: MouseEvent): void {
      const el = ev.target as HTMLDivElement
      if (isDown) {
        Object.assign(el.style, {
          left: currentLeft + (ev.clientX - clickLeft) + 'px',
          top: currentTop + (ev.clientY - clickTop) + 'px',
        })
      }
    }

    function onMouseUp(ev: MouseEvent): void {
      isDown = false
    }

    return {
      onMouseDown,
      onMouseMove,
      onMouseUp,
    }
  })()

  return coreEventHandle
}

export default useMoveHook
