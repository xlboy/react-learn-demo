import { Button } from 'antd'
import React, { FC, memo, useMemo, useState } from 'react'
import Battlefield_ from './components/Battlefield'
import TopPlantSelect from './components/TopPlantSelect'
import gameController from './core/gameController'
import Provider from './core/store/Provider'
import useStore from './core/store/useStore'
import './index.less'
import { Battlefield } from './typings/battlefield'



function PlantVSZombies(): JSX.Element {
  const store = useStore()
  const rootContextRef = React.createRef() as Battlefield.RootContextRef
  const StartBtn = (): JSX.Element => {
    const onClick = () => {
      gameController.startPutZombie()
    }
    const restartGame = () => {
      gameController.restartGame()
      rootContextRef.current(Math.random())
      // console.log('rootContextRef', )
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
        <Battlefield_ rootContextRef={rootContextRef} />
      </Provider>
    </div>
  )
}

export default PlantVSZombies
