import React, { useImperativeHandle, useRef, useState } from 'react'
import './index.less'
import { Battlefield as BattlefieldType } from '../../typings/battlefield'
import useStore from '../../core/store/useStore'
import classNames from 'classnames'
import ZombiesMain from './Components/Zombie/ZombieMain'
import gif from '@/assets/images/plant_vs_zombies/pic_potatoes_1.gif'
function Battlefield(props: { rootContextRef: BattlefieldType.RootContextRef }): JSX.Element {
  const { rootContextRef } = props
  const battlefieldElRef = useRef<HTMLDivElement>()
  const store = useStore()
  return (
    <div className='battlefield' ref={battlefieldElRef}>
      <PlantGrid />
      <ZombiesMain battlefieldElRef={battlefieldElRef} />
    </div>
  )

  function PlantGrid(): JSX.Element {
    const plantGrids = initPlantGrids()
    const [, refreshBattlefield] = useState(0)
    useImperativeHandle(rootContextRef, () => ({
      refreshPlantGrids: () => refreshBattlefield(v => v + 1),
    }))

    return (
      <>
        {plantGrids.map((grid, index) => (
          <PlantGrid key={index} {...grid} />
        ))}
      </>
    )

    function PlantGrid(props: BattlefieldType.PlantGridProps): JSX.Element {
      const [gridState, setGridState] = useState<BattlefieldType.PlantGridProps>(props)
      const gridElRef = useRef<HTMLDivElement>()
      const [previewPlantSrc, setPreviewPlantSrc] = useState<null | string>(null)
      const { style: gridStyle, plant: gridPlant } = gridState
      const plantHpContextRef = React.useRef() as BattlefieldType.PropsBase['plantHpContextRef']
      const plantMessageContextRef =
        React.useRef() as BattlefieldType.PropsBase['plantMessageContextRef']
      // console.log('哦，', previewPlantSrc)
      return (
        <div
          ref={gridElRef}
          className={classNames('battlefield-grid', { 'z-index-5': previewPlantSrc !== null })}
          style={{
            ...gridStyle,
            backgroundImage: `url(${previewPlantSrc})`,
          }}
          key={Math.random().toString(36)}
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
                key={Math.random().toString()}
              />
              <PlantHp />
              <PlantMessage />
            </>
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
        const plantHpElRef = useRef<HTMLDivElement>()
        useImperativeHandle(plantHpContextRef, () => ({
          updateHp(width: string): void {
            plantHpElRef.current.style.width = width
          },
        }))
        return (
          <div className='plant-hp'>
            <div className='hp-fill' ref={plantHpElRef}></div>
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
          setPreviewPlantSrc(() => null)
        }
      }
    }
    function initPlantGrids(): BattlefieldType.PlantGridProps[] {
      const grids: BattlefieldType.PlantGridProps[] = []
      for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 10; y++) {
          const grid: BattlefieldType.PlantGridProps = {
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

export default Battlefield
