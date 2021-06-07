import React, { useImperativeHandle, useRef, useState } from 'react'
import './index.less'
import { Battlefield } from '../../typings/battlefield'
import useStore from '../../core/store/useStore'
import classNames from 'classnames'
import ZombiesMain from './Components/Zombie/ZombieMain'

function Battlefield_(props: { rootContextRef: Battlefield.RootContextRef }): JSX.Element {
  const { rootContextRef } = props
  const battlefieldElRef = useRef<HTMLDivElement>()
  const store = useStore()
  return (
    <div className='battlefield' ref={battlefieldElRef}>
      <CoreComponent />
      <ZombiesMain battlefieldElRef={battlefieldElRef} />
    </div>
  )

  function CoreComponent(): JSX.Element {
    const battlefieldGrids = initBattlefieldGrids()
    const [, refreshBattlefield] = useState()
    useImperativeHandle(rootContextRef, () => refreshBattlefield as any)
    return (
      <>
        {battlefieldGrids.map((grid, index) => (
          <BattlefieldPlantGrid key={index} {...grid} />
        ))}
      </>
    )

    function BattlefieldPlantGrid(props: Battlefield.GridProps): JSX.Element {
      const [gridState, setGridState] = useState<Battlefield.GridProps>(props)
      const gridElRef = useRef<HTMLDivElement>()
      const [previewPlantSrc, setPreviewPlantSrc] = useState<null | string>(null)
      const { style: gridStyle, plant: gridPlant } = gridState
      const plantHpContextRef = React.createRef() as Battlefield.PropsBase['plantHpContextRef']
      const plantMessageContextRef =
        React.createRef() as Battlefield.PropsBase['plantMessageContextRef']
      return (
        <div
          ref={gridElRef}
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
                battlefieldElRef={battlefieldElRef}
                plantMessageContextRef={plantMessageContextRef}
                positionStyle={gridStyle}
                plantHpContextRef={plantHpContextRef}
                removePlant={removePlant}
                key={~~(Math.random() * 999999)}
              />
              <PlantHp />
              <PlantMessage />
            </>
          )}
          {previewPlantSrc !== null && (
            <img className='battlefield-grid__preview' src={previewPlantSrc} />
          )}
        </div>
      )

      function PlantMessage(): JSX.Element {
        const [isVisible, setIsVisible] = useState(false)
        const [title, setTitle] = useState('')
        useImperativeHandle(plantMessageContextRef, () => ({
          setMessage(message: string): void {
            setTitle(message)
            setIsVisible(true)
            setTimeout(() => {
              setIsVisible(false)
            }, 2000)
          },
        }))
        return <>{isVisible && <div className='plant-message'>{title}</div>}</>
      }

      function PlantHp(): JSX.Element {
        const plantHpElRef_ = useRef<HTMLDivElement>()
        useImperativeHandle(plantHpContextRef, () => ({
          updateHp(width: string): void {
            plantHpElRef_.current.style.width = width
          },
        }))
        return (
          <div className='plant-hp'>
            <div className='hp-fill' ref={plantHpElRef_}></div>
          </div>
        )
      }

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
}

export default Battlefield_
