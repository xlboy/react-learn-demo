import { CSSProperties, Dispatch } from 'react'
import { Plant } from './plant'

export namespace Battlefield {
  export interface positionStyle {
    left: string
    top: string
  }
  export interface PlantGridProps {
    id: Symbol
    style: CSSProperties & positionStyle
    plant: {
      Component(props: PropsBase): JSX.Element
    } | null
  }

  export interface PropsBase {
    positionStyle: Battlefield.positionStyle
    battlefieldElRef: React.MutableRefObject<HTMLDivElement>
    removePlant(): void
    plantHpContextRef: React.MutableRefObject<{
      updateHp(width: string): void
    }>
    plantMessageContextRef: React.MutableRefObject<{
      setMessage(message: string): void
    }>
  }
  export type RootContextRef = React.MutableRefObject<{
    refreshPlantGrids(): void
  }>
}
