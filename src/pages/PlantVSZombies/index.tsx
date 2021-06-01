import { Button } from 'antd'
import React, { FC, memo, useMemo, useState } from 'react'
import Battlefield from './components/Battlefield'
import TopPlantSelect from './components/TopPlantSelect'
import gameController from './core/gameController'
import Provider from './core/store/Provider'
import useStore from './core/store/useStore'
import './index.less'

function PlantVSZombies(): JSX.Element {
  const store = useStore()
  const StartBtn = (): JSX.Element => {
    const onClick = () => {
      gameController.startPutZombie()
    }
    const onStop = () => {
      gameController.stopPutZomzbie()
    }
    return (
      <div className='start-btn'>
        <Button onClick={onClick}>Start</Button>
        <Button onClick={onStop} style={{ marginLeft: '5px' }}>
          Stop
        </Button>
      </div>
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
