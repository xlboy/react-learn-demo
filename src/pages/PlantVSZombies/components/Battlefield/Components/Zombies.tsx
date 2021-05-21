import { Battlefield } from '@/pages/PlantVSZombies/typings/battlefield'
import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
interface ZombiesProps extends Battlefield.PropsBase {}
function Zombies(props: ZombiesProps): JSX.Element {
  const [target, setTarget] = useState<HTMLDivElement>(null)
  const { positionStyle, battlefieldRef } = props
  useEffect(() => {
    setTarget(battlefieldRef.current)
  }, [])
  const style: CSSProperties = {}
  const Component = () => {
    const imgRef = useRef<HTMLImageElement>()
    useEffect(() => {
      ;(function animloop() {
        if (imgRef.current !== null) {
          const { left } = imgRef.current.style
          Object.assign(imgRef.current.style, {
            left: `${parseInt(left) + 20}px`,
          })

          void (function verifBeyondLimit() {
            if (parseInt(left) > 1160) {
              console.log('恩，超出了')
            }
          })()

          requestAnimationFrame(animloop)
        }
      })()
    }, [])
    return (
      <>
        <img
          style={{
            ...style,
            ...positionStyle,
          }}
          src={require('@/assets/images/plant_vs_zombies/pic_zombie-1.gif')}
        />
      </>
    )
  }
  return target ? ReactDOM.createPortal(<Component />, target) : null
}

export default Zombies
