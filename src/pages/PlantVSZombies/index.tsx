import { Button } from 'antd'
import React, { FC, memo, useMemo, useState } from 'react'
import Battlefield from './components/Battlefield'
import TopPlantSelect from './components/TopPlantSelect'
import Provider from './core/store/Provider'
import useStore from './core/store/useStore'
import './index.less'

function PlantVSZombies(): JSX.Element {
  const store = useStore()
  const StartBtn = (): JSX.Element => {
    const onClick = () => {
      store.setIsStart(!store.isStart)
    }
    return (
      <Button className='start-btn' onClick={onClick}>
        Start
      </Button>
    )
  }
  return (
    <div className='plant-zombies'>
      <Provider>
        <StartBtn />
        <TopPlantSelect />
        <Battlefield />
      </Provider>
    </div>
  )
}

export default PlantVSZombies
