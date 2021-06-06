import { CSSProperties } from 'react'
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
    battlefieldRef: React.MutableRefObject<HTMLDivElement>
    removePlant(): void
    plantHpRef: React.RefObject<{
      updateHp(width: string): void
    }>
  }
}
