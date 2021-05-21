import React from 'react'
import Battlefield from './components/Battlefield'
import TopPlantSelect from './components/TopPlantSelect'
import Provider from './core/store/Provider'
import './index.less'

function PlantVSZombies(): JSX.Element {
  return (
    <div className='plant-zombies'>
      <Provider>
        <TopPlantSelect />
        <Battlefield />
      </Provider>
    </div>
  )
}

export default PlantVSZombies
