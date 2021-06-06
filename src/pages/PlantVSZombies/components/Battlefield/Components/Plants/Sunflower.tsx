import React, { CSSProperties, Fragment, useEffect, useMemo, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { Battlefield } from '@/pages/PlantVSZombies/typings/battlefield'
import useStore from '@/pages/PlantVSZombies/core/store/useStore'
import allPlantConfig, { PlantConfig } from '@/pages/PlantVSZombies/core/configs/allPlantConfig'
import { Reproduction } from '@/pages/PlantVSZombies/typings/plant/reproduction'
import { message } from 'antd'
import useAddRemoveActiveContent, {
  AddRemoveActiveContentType,
} from '@/pages/PlantVSZombies/core/gameController/useAddRemoveActiveContent'
import {
  ActiveContent,
  ActiveType,
  CollideType,
} from '@/pages/PlantVSZombies/typings/gameController'
import { Plant } from '@/pages/PlantVSZombies/typings/plant'
interface SunflowerState extends Battlefield.PropsBase {}
interface PlantBase {
  /**阳光生产的时间间隔 */
  sunInterval: number
}

const plantName = '向日葵'
function Sunflower(props: SunflowerState): JSX.Element {
  const { positionStyle, battlefieldRef, plantHpRef } = props
  const [isShowSun, setIsShowSun] = useState(false)
  const plantConfig = useMemo<PlantConfig<Plant.Type.Reproduction>>(
    () =>
      allPlantConfig.find(item => item.name === plantName) as PlantConfig<Plant.Type.Reproduction>,
    []
  )

  const plantBase: PlantBase = (() => {
    const { interval, defenseValue } = plantConfig.content.content
    return {
      defenseValue,
      sunInterval: interval * 1000,
    }
  })()

  const delayShowSun = () => {
    setTimeout(() => setIsShowSun(() => true), plantBase.sunInterval)
  }

  const [, removePlantTag] = useMemo<AddRemoveActiveContentType>(() => {
    return useAddRemoveActiveContent({
      ...positionStyle,
      type: ActiveType.Plant,
      content: plantConfig as PlantConfig,
      collideCallback: plantCollideCallback,
    })

    function plantCollideCallback(collideType: CollideType, collideTarget: ActiveContent) {
      switch (collideType) {
        case CollideType.XYAxleCollide:
        // console.log('我草泥马，逼崽子，你妈的哟，我叼你吗的哟')
      }
    }
  }, [])

  useEffect(() => {
    delayShowSun()
  }, [])

  const store = useStore()
  return (
    <>
      <img src={require('@/assets/images/plant_vs_zombies/pic_sunflower.png')} />
      <SunDrop />
    </>
  )

  function SunDrop(): React.ReactPortal {
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

    return ReactDOM.createPortal(<Component />, battlefieldRef.current)
  }
}

export default Sunflower
