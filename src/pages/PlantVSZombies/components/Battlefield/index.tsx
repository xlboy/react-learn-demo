import React, { useImperativeHandle, useRef, useState } from 'react'
import './index.less'
import { Battlefield } from '../../typings/battlefield'
import useStore from '../../core/store/useStore'
import classNames from 'classnames'
import ZombiesMain from './Components/Zombie/ZombieMain'
import { observer } from 'mobx-react'
import gameController from '../../core/gameController'

function Battlefield_(): JSX.Element {
  const battlefieldRef = useRef<HTMLDivElement>()
  const store = useStore()
  const battlefieldGrids = initBattlefieldGrids()

  return (
    <div className='battlefield' ref={battlefieldRef}>
      {battlefieldGrids.map((grid, index) => (
        <BattlefieldPlantGrid key={index} {...grid} />
      ))}
      <ZombiesMain battlefieldRef={battlefieldRef} />
    </div>
  )

  function BattlefieldPlantGrid(props: Battlefield.GridProps): JSX.Element {
    const [gridState, setGridState] = useState<Battlefield.GridProps>(props)
    const gridRef = useRef<HTMLDivElement>()
    const [previewPlantSrc, setPreviewPlantSrc] = useState<null | string>(null)
    const { style: gridStyle, plant: gridPlant } = gridState
    const plantHpRef = React.createRef() as Battlefield.PropsBase['plantHpRef']
    const PlantHp = () => {
      const plantHpRef_ = useRef<HTMLDivElement>()
      useImperativeHandle(plantHpRef, () => ({
        updateHp(width: `${number}%`): void {
          plantHpRef_.current.style.width = width
        },
      }))
      return (
        <div className='plant-hp'>
          <div className='hp-fill' ref={plantHpRef_}></div>
        </div>
      )
    }
    return (
      <div
        ref={gridRef}
        className={classNames('battlefield-grid', { 'z-index-5': previewPlantSrc !== null })}
        style={gridStyle}
        key={~~(Math.random() * 999999)}
        onClick={clickAddPlant}
        onMouseOver={overShowPreview}
        onMouseOut={outHidePreview}
      >
        {gridPlant !== null && (
          <>
            <gridPlant.Component
              battlefieldRef={battlefieldRef}
              positionStyle={gridStyle}
              plantHpRef={plantHpRef}
              removePlant={removePlant}
              key={~~(Math.random() * 999999)}
            />
            <PlantHp />
          </>
        )}
        {previewPlantSrc !== null && (
          <img className='battlefield-grid__preview' src={previewPlantSrc} />
        )}
      </div>
    )

    function removePlant(): void {
      setGridState(state => ({ ...state, plant: null }))
    }

    function clickAddPlant(): void {
      const { currentSelectPlant, setCurrentSelectPlant } = store
      if (currentSelectPlant) {
        setGridState(state => ({
          ...state,
          plant: { Component: currentSelectPlant.Component },
        }))
        setCurrentSelectPlant(null)
        setPreviewPlantSrc(null)
      }
    }

    function overShowPreview(): void {
      const { currentSelectPlant } = store
      if (currentSelectPlant && previewPlantSrc === null && gridState.plant === null) {
        const { image } = currentSelectPlant
        setPreviewPlantSrc(image)
      }
    }

    function outHidePreview(): void {
      const { currentSelectPlant } = store
      if (currentSelectPlant) {
        setPreviewPlantSrc(null)
      }
    }
  }

  function initBattlefieldGrids(): Battlefield.GridProps[] {
    const grids: Battlefield.GridProps[] = []
    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 10; y++) {
        const grid: Battlefield.GridProps = {
          id: Symbol(),
          style: {
            left: `${110 * y}px`,
            top: `${110 * x}px`,
          },
          plant: null,
        }
        grids.push(grid)
      }
    }
    return grids
  }
}

export default Battlefield_
