import React, { CSSProperties, Fragment, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { Battlefield } from '@/pages/PlantVSZombies/typings/battlefield'
import useStore from '@/pages/PlantVSZombies/core/store/useStore'
import allPlantConfig, { PlantConfig } from '@/pages/PlantVSZombies/core/configs/allPlantConfig'
import { Reproduction } from '@/pages/PlantVSZombies/typings/plant/reproduction'
import { message } from 'antd'
interface SunflowerState extends Battlefield.PropsBase {}

const plantName = '向日葵'
function Sunflower(props: SunflowerState): JSX.Element {
  const { positionStyle, battlefieldRef } = props
  const [isShowSun, setIsShowSun] = useState(false)
  const [plantConfig] = useState(allPlantConfig.find(item => item.name === plantName))
  const sunInterval: number = (plantConfig.content.content as Reproduction.Content).interval * 1000
  const delayShowSun = () => setTimeout(() => setIsShowSun(() => true), sunInterval)

  useEffect(() => {
    delayShowSun()
  }, [])
  if (plantConfig === undefined) {
    message.error(`${plantName}配置有误`)
    throw new Error(`${plantName}配置有误`)
  }

  const store = useStore()
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
        cursor: 'pointer',
      }

      return (
        <>
          {isShowSun && (
            <img
              src={require('@/assets/images/plant_vs_zombies/pic_sun.gif')}
              style={style}
              onClick={sunClick}
            />
          )}
        </>
      )

      function sunClick(): void {
        const { sunNumber, setSunNumber } = store
        setSunNumber(sunNumber + 50)
        setIsShowSun(() => false)
        delayShowSun()
      }
    }

    return target ? ReactDOM.createPortal(<Component />, target) : null
  }
}

export default Sunflower