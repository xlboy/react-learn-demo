import { Battlefield } from '@/pages/PlantVSZombies/typings/battlefield'
import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'

interface ZombieBox {
  isShow: boolean
}

function ZombieMain(): JSX.Element {
  const allZombieBox = initAllZombieBox()
  return (
    <>
      {allZombieBox.map((box, i) => (
        <ZombieSlot key={i} />
      ))}
    </>
  )

  function ZombieSlot(): JSX.Element {
    return <></>
  }

  function initAllZombieBox(): ZombieBox[] {
    const zombieBoxSrouce: ZombieBox[] = []
    for (let i = 0; i < 100; i++) {
      const zombieBoxObj: ZombieBox = {
        isShow: false,
      }

      zombieBoxSrouce.push(zombieBoxObj)
    }
    return zombieBoxSrouce
  }
}

export default ZombieMain
