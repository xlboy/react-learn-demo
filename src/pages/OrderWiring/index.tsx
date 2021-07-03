import React, { useState } from 'react'
import './index.less'
import { useMemo } from 'react'
import { useCallback } from 'react'

interface Coordinates {
  left: number
  top: number
}
type LinePathSrouce = Array<Coordinates[]>
interface Ball extends Coordinates {}

const pageConfig = {
  width: 1100,
  height: 700,
} as const

const generateBalls = (ballNumber = 10): Ball[] => {
  const balls: Ball[] = []
  for (let i = 0; i < ballNumber; i++) {
    const ballLeft = ~~(Math.random() * pageConfig.width)
    const ballTop = ~~(Math.random() * pageConfig.height)
    balls.push({
      left: ballLeft,
      top: ballTop,
    })
  }
  return balls
}

const OrderWiring: React.FC = () => {
  const [balls, setBalls] = useState<Ball[]>(generateBalls())

  const computedBallLine = useCallback((ball1: Ball, ball2: Ball) => {
    const differenceX = ball2.left - ball1.left
    const differenceY = ball2.top - ball1.top
    const offsetHeight = differenceY / differenceX
    const lineSrouce: Coordinates[] = []
    for (let i = 0; i < Math.abs(differenceX); i++) {
      let startItem: Ball = ball2
      if (differenceX <= 0) {
        startItem = ball2
      } else if (differenceY >= 0) {
        startItem = ball1
      } else if (differenceY <= 0) {
        startItem = ball1
      }
      lineSrouce.push({
        left: startItem.left + i,
        top: startItem.top + offsetHeight * i,
      })
    }
    return lineSrouce
  }, [])

  const ballsLinePathSrouce = useMemo<LinePathSrouce>(() => {
    const lineSrouce: LinePathSrouce = []
    let preBall: Ball
    for (let i = 0; i < balls.length - 1; i++) {
      let ball1: Ball, ball2: Ball
      ball1 = balls[i === 0 ? 0 : i]
      preBall = ball2 = balls[i + 1]
      lineSrouce.push(computedBallLine(ball1, ball2))
    }
    return lineSrouce
  }, [balls])

  const resetGenerateBalls = (): void => {
    setBalls(generateBalls())
  }
  return (
    <div className='order-wiring'>
      <button onClick={resetGenerateBalls}>generate</button>
      {balls.map((ball, index) => (
        <div className='order-wiring__ball' style={ball} key={index}>
          {index + 1}
        </div>
      ))}
      {ballsLinePathSrouce.map((ballPath, ballPathIndex) =>
        ballPath.map((path, pathIndex) => (
          <div
            key={`${ballPathIndex}-${pathIndex}`}
            style={{
              position: 'absolute',
              height: '1px',
              width: '1px',
              left: `${path.left}px`,
              top: `${path.top}px`,
              background: 'red',
              zIndex: 9,
            }}
          ></div>
        ))
      )}
    </div>
  )
}

export default OrderWiring
