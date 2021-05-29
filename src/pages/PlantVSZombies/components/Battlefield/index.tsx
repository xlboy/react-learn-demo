import React, { useMemo, useRef, useState } from 'react'
import './index.less'
import { Battlefield } from '../../typings/battlefield'
import Peas1 from './Components/Peas1'
import Sunflower from './Components/Sunflower'
import useStore from '../../core/store/useStore'
import classNames from 'classnames'
import { useLocalStore, useObserver } from 'mobx-react'
import battlefieldCollideDetect, { ActiveContent } from '../../core/battlefieldCollideDetect'

function Battlefield_(): JSX.Element {
  const battlefieldRef = useRef<HTMLDivElement>()
  const store = useStore()
  const battlefieldGrids = initBattlefieldGrids()

  return (
    <div className='battlefield' ref={battlefieldRef}>
      {battlefieldGrids.map((grid, index) => (
        <BattlefieldGrid key={index} {...grid} />
      ))}
    </div>
  )

  function BattlefieldGrid(props: Battlefield.GridProps): JSX.Element {
    const [gridState, setGridState] = useState<Battlefield.GridProps>(props)
    const gridRef = useRef<HTMLDivElement>()
    const [previewPlantSrc, setPreviewPlantSrc] = useState<null | string>(null)
    const { style: gridStyle, plant: gridPlant } = gridState

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
          <gridPlant.Component
            battlefieldRef={battlefieldRef}
            positionStyle={gridStyle}
            clearPlant={clearPlant}
            key={~~(Math.random() * 999999)}
          />
        )}
        {previewPlantSrc !== null && (
          <img className='battlefield-grid__preview' src={previewPlantSrc} />
        )}
      </div>
    )

    function clearPlant(): void {
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
