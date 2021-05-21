import React, { CSSProperties, Fragment, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { Battlefield } from '@/pages/PlantVSZombies/typings/battlefield'
import { Plant } from '@/pages/PlantVSZombies/typings/plant'
interface SunflowerState extends Plant.ComponentPropsBase {}

function Sunflower(props: SunflowerState): JSX.Element {
  const { positionStyle, battlefieldRef } = props
  return (
    <>
      <img src={require('@/assets/images/plant_vs_zombies/pic_sunflower.png')} />
      <SunDrop />
    </>
  )

  function SunDrop(): React.ReactPortal {
    const [target, setTarget] = useState<HTMLDivElement>(null)
    useEffect(() => {
      setTarget(battlefieldRef.current)
    }, [])

    const Component = () => {
      const style: CSSProperties = {
        position: 'absolute',
        left: `${parseInt(positionStyle.left) + 80}px`,
        top: `${parseInt(positionStyle.top) + 40}px`,
        width: '60px',
        cursor: 'pointer'
      }

      return (
        <img src={require('@/assets/images/plant_vs_zombies/pic_sun.gif')} style={style} />
      )
    }

    return target ? ReactDOM.createPortal(<Component />, target) : null
  }
}

export default Sunflower
