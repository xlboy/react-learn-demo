import { CSSProperties, Dispatch } from 'react'
import { Plant } from './plant'

export namespace Battlefield {
  export interface positionStyle {
    left: string
    top: string
  }
  export interface GridProps {
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
    plantHpContextRef: React.RefObject<{
      updateHp(width: string): void
    }>
    plantMessageContextRef: React.RefObject<{
      setMessage(message: string): void
    }>
  }
  export type RootContextRef = React.RefObject<(v: number) => void>
}
