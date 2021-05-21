import React, { useRef } from 'react'
import './index.less'
import { Battlefield } from '../../typings/battlefield'
import Peas1 from './Components/Peas1'
import Sunflower from './Components/Sunflower'
const obj: Battlefield.GridProps = {
  style: {
    left: '10px',
    top: '10px',
  },
  id: Symbol(),
  plant: {
    Component: Peas1,
  },
}
const obj2: Battlefield.GridProps = {
  style: {
    left: '120px',
    top: '10px',
  },
  id: Symbol(),
  plant: {
    Component: Sunflower,
  },
}

function Battlefield_(): JSX.Element {
  const battlefieldRef = useRef<HTMLDivElement>()
  return (
    <div className='battlefield' ref={battlefieldRef}>
      {[obj, obj2].map((grid, index) => (
        <BattlefieldGrid key={index} {...grid} />
      ))}
    </div>
  )

  function BattlefieldGrid(props: Battlefield.GridProps): JSX.Element {
    const { style, plant } = props
    return (
      <div className='battlefield-grid' style={style}>
        {plant !== null && (
          <plant.Component
            battlefieldRef={battlefieldRef}
            positionStyle={{
              left: style.left,
              top: style.top,
            }}
          />
        )}
      </div>
    )
  }
}

export default Battlefield_
