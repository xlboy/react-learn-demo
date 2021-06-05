import { ZombieConfig } from '@/pages/PlantVSZombies/core/configs/allZombieConfig'
import gameController from '@/pages/PlantVSZombies/core/gameController'
import { Zombie } from '@/pages/PlantVSZombies/typings/zombie'
import _ from 'lodash'
import React, { Dispatch, SetStateAction, useEffect, useImperativeHandle, useState } from 'react'
import ReactDOM from 'react-dom'

namespace ZombieSlot {
  export interface Props {
    slotRef: React.RefObject<{
      setZombieConfig: Dispatch<SetStateAction<ZombieConfig>>
      setStartPosition: Dispatch<SetStateAction<Zombie.PropsBase['positionStyle'] | null>>
    }>
    removeZombie(): void
  }
}

interface ZombieMainProps {
  battlefieldRef: React.MutableRefObject<HTMLDivElement>
}
function ZombieMain(props: ZombieMainProps): JSX.Element {
  const { battlefieldRef } = props
  return (
    <>
      {new Array(50).fill(0).map((_, i) => (
        <CoreComponent key={i} />
      ))}
    </>
  )
  function CoreComponent(): JSX.Element {
    const slotRef: ZombieSlot.Props['slotRef'] = React.createRef()
    const slotTag = Symbol()
    const addZombie = (
      zombieConfig: ZombieConfig,
      startPosition: Zombie.PropsBase['positionStyle']
    ) => {
      slotRef.current.setZombieConfig(zombieConfig)
      slotRef.current.setStartPosition(startPosition)
      zombieSlotObj.hasZombie = true
    }
    const removeZombie = () => {
      slotRef.current.setZombieConfig(null)
      zombieSlotObj.hasZombie = false
    }
    const zombieSlotObj = {
      id: slotTag,
      addZombie,
      removeZombie,
      hasZombie: false,
    }
    // 在此处将僵尸槽位控制函数提供给 游戏控制器
    gameController.addZombieSlot(zombieSlotObj)
    return <ZombieSlot slotRef={slotRef} removeZombie={removeZombie} />
  }

  function ZombieSlot(props: ZombieSlot.Props): JSX.Element {
    const { slotRef, removeZombie } = props
    const [zombieConfig, setZombieConfig] = useState<ZombieConfig | null>(null)
    const [startPosition, setStartPosition] =
      useState<Zombie.PropsBase['positionStyle'] | null>(null)
    useImperativeHandle(slotRef, () => ({
      setZombieConfig,
      setStartPosition,
    }))
    const zombieComponentProps: Zombie.PropsBase = {
      battlefieldRef,
      removeZombie,
      zombieConfig,
      positionStyle: { ...startPosition },
    }
    return (
      <>
        {zombieConfig !== null && startPosition !== null && (
          <zombieConfig.Component {...zombieComponentProps} />
        )}
      </>
    )
  }
}

export default ZombieMain
