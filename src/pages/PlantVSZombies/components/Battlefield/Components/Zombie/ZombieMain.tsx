import gameController from '@/pages/PlantVSZombies/core/gameController'
import React, { Dispatch, SetStateAction, useEffect, useImperativeHandle, useState } from 'react'
import ReactDOM from 'react-dom'

namespace ZombieSlot {
  export interface Props {
    slotRef: React.RefObject<{
      setZombieComponent: Dispatch<SetStateAction<ZombieSlot.Component>>
    }>
  }

  export type Component = null | ((...args: any[]) => JSX.Element)
}

function ZombieMain(): JSX.Element {
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
    const addZombie = () => slotRef.current.setZombieComponent(() => <div>1</div>)
    const removeZombie = () => slotRef.current.setZombieComponent(null)
    gameController.addZombieSlots({
      id: slotTag,
      addZombie,
      removeZombie,
      hasZombie: false,
    })
    return <ZombieSlot slotRef={slotRef} />
  }

  function ZombieSlot(props: ZombieSlot.Props): JSX.Element {
    const { slotRef } = props
    const [ZombieComponent, setZombieComponent] = useState<ZombieSlot.Component>(null)
    useImperativeHandle(slotRef, () => ({
      setZombieComponent,
    }))
    return <>{ZombieComponent !== null && <ZombieComponent />}</>
  }
}

export default ZombieMain
