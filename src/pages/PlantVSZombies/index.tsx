import { Button } from 'antd'
import React from 'react'
import Battlefield from './components/Battlefield'
import TopPlantSelect from './components/TopPlantSelect'
import gameController from './core/gameController'
import Provider from './core/store/Provider'
import './index.less'
import { Battlefield as BattlefieldType } from './typings/battlefield'

function PlantVSZombies(): JSX.Element {
  const rootContextRef = React.useRef() as BattlefieldType.RootContextRef
  const StartBtn = (): JSX.Element => {
    const onClick = () => {
      gameController.startPutZombie()
    }
    const restartGame = () => {
      gameController.restartGame()
      rootContextRef.current.refreshPlantGrids()
    }
    return (
      <div className='start-btn'>
        <Button onClick={onClick}>Start</Button>
        <Button onClick={restartGame} style={{ marginLeft: '5px' }}>
          restart
        </Button>
      </div>
    )
  }
  return (
    <div className='plant-zombies'>
      <Provider>
        <StartBtn />
        <TopPlantSelect />
        <Battlefield rootContextRef={rootContextRef} />
      </Provider>
    </div>
  )
}

export default PlantVSZombies
