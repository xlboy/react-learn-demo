import { CSSProperties } from 'react'
import { Plant } from './plant'

export namespace Battlefield {
  export interface positionStyle {
    left: `${number}px`
    top: `${number}px`
  }
  export interface GridProps {
    id: Symbol
    style: CSSProperties & positionStyle
    plant: {
      Component(
        props: {
          [k in keyof PropsBase]: PropsBase[k]
        }
      ): JSX.Element
    } | null
  }

  export interface PropsBase {
    positionStyle: Battlefield.positionStyle
    battlefieldRef: React.MutableRefObject<HTMLDivElement>
  }
}
