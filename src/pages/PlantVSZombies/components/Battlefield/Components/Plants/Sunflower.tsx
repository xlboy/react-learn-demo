import React, { CSSProperties, Fragment, useEffect, useMemo, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { Battlefield } from '@/pages/PlantVSZombies/typings/battlefield'
import useStore from '@/pages/PlantVSZombies/core/store/useStore'
import allPlantConfig, { PlantConfig } from '@/pages/PlantVSZombies/core/configs/allPlantConfig'
import useAddRemoveActiveContent, {
  AddRemoveActiveContentType,
} from '@/pages/PlantVSZombies/core/gameController/useAddRemoveActiveContent'
import {
  ActiveContent,
  ActiveType,
  SwapType,
} from '@/pages/PlantVSZombies/typings/gameController'
import { Plant } from '@/pages/PlantVSZombies/typings/plant'
interface SunflowerState extends Battlefield.PropsBase {}
interface PlantBase {
  defenseValue: number
  /**阳光生产的时间间隔 */
  sunInterval: number
}

const plantName = '向日葵'
function Sunflower(props: SunflowerState): JSX.Element {
  const {
    positionStyle,
    battlefieldElRef,
    plantHpContextRef,
    plantMessageContextRef,
    removePlant,
  } = props
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
      collideCallback() {},
      swapCallback: plantSwapCallback,
    })

    function plantSwapCallback(swapType: SwapType, swapTarget: ActiveContent): void {
      switch (swapType) {
        case SwapType.NowAttack:
          if (swapTarget.type === ActiveType.Zombie) {
            // 避免植物死后，还受到了僵尸的攻击
            if (plantBase.defenseValue <= 0) return
            plantMessageContextRef.current.setMessage('呜呜,救命啊')
            const initHp = plantConfig.content.content.defenseValue
            const { hurtValue } = swapTarget.content.content.content
            plantBase.defenseValue -= hurtValue
            plantHpContextRef.current.updateHp(`${(plantBase.defenseValue / initHp) * 100}%`)
            if (plantBase.defenseValue <= 0) {
              removePlantTag()
              removePlant()
            }
          }
          return
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

    return ReactDOM.createPortal(<Component />, battlefieldElRef.current)
  }
}

export default Sunflower
