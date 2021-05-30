import { Button } from 'antd'
import React from 'react'
import Battlefield from './components/Battlefield'
import TopPlantSelect from './components/TopPlantSelect'
import Provider from './core/store/Provider'
import './index.less'

function PlantVSZombies(): JSX.Element {
  const StartBtn = (): JSX.Element => {
    const onClick = () => {
      
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
