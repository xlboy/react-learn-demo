import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { Battlefield } from '@/pages/PlantVSZombies/typings/battlefield'
interface Peas1Props extends Battlefield.PropsBase {}

function Peas1(props: Peas1Props): JSX.Element {
  const { positionStyle, battlefieldRef } = props
  type Skill = (...args: any) => React.ReactPortal
  const [skills, setSkills] = useState<Skill[]>([LaunchBullet])
  return (
    <>
      <img src={require('@/assets/images/plant_vs_zombies/pic_peas_1.gif')} />
      {skills.map((Component, index) => (
        <Component key={index} />
      ))}
    </>
  )

  function LaunchBullet(props: { index: number }): React.ReactPortal {
    const { index } = props
    const [target, setTarget] = useState<HTMLDivElement>(null)
    useEffect(() => {
      setTarget(battlefieldRef.current)
    }, [])

    const Component = () => {
      const style: CSSProperties = {
        position: 'absolute',
        left: `${parseInt(positionStyle.left) + 50}px`,
        top: `${parseInt(positionStyle.top) + 20}px`,
        zIndex: 3,
      }
      const imgRef = useRef<HTMLImageElement>()
      useEffect(() => {
        ;(function animloop() {
          if (imgRef.current !== null) {
            const { left } = imgRef.current.style
            Object.assign(imgRef.current.style, {
              left: `${parseInt(left) + 15}px`,
            })

            void (function verifBeyondLimit() {
              if (parseInt(left) > 1160) {
                setSkills(state => {
                  // state.splice(index, 1)
                  return [...state]
                })
              }
            })()

            requestAnimationFrame(animloop)
          }
        })()
      }, [])

      return (
        <img
          ref={imgRef}
          src={require('@/assets/images/plant_vs_zombies/pic_peas_bullet.gif')}
          style={style}
        />
      )
    }

    return target ? ReactDOM.createPortal(<Component />, target) : null
  }
}

export default Peas1
