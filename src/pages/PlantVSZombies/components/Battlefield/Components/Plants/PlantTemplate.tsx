import React, { CSSProperties, useEffect, useMemo, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { Battlefield } from '@/pages/PlantVSZombies/typings/battlefield'
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
interface PlantTemplateState extends Battlefield.PropsBase {}
interface PlantBase {
  defenseValue: number
}

const plantName = 'xxxx'
function PlantTemplate(props: PlantTemplateState): JSX.Element {
  const {
    positionStyle,
    battlefieldElRef,
    plantHpContextRef,
    plantMessageContextRef,
    removePlant,
  } = props
  const plantConfig = useMemo<PlantConfig<Plant.Type.Reproduction>>(
    () =>
      allPlantConfig.find(item => item.name === plantName) as PlantConfig<Plant.Type.Reproduction>,
    []
  )

  const plantBase: PlantBase = (() => {
    const { defenseValue } = plantConfig.content.content
    return {
      defenseValue
    }
  })()


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
            
          }
          return
      }
    }
  }, [])

  return (
    <>
      <img src={require('@/assets/images/plant_vs_zombies/pic_sunflower.png')} />
    </>
  )
}

export default PlantTemplate
