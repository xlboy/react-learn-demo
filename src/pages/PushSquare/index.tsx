import { message, Form, Input, Button } from 'antd'
import React, { useState } from 'react'
import classNames from 'classnames'
import './index.less'
import { Matrix } from './typings'

const initMatrixSize: Matrix.State['size'] = {
  width: 3,
  height: 3,
}

interface HasBegunTime {
  timer: null | NodeJS.Timeout
  seconds: number
}

function PushSquare(): JSX.Element {
  const [matrix, setMatrix] = useState<Matrix.State>({
    size: { ...initMatrixSize },
    source: initMatrixSource(initMatrixSize),
    isStart: false,
  })
  const [hasBegunTime, setHasBegunTime] = useState<HasBegunTime>({
    timer: null,
    seconds: 0,
  })

  return (
    <div className='push-square'>
      <div className='matrix' style={{ width: matrix.size.width * 100 }}>
        {matrix.source.map((e, yIndex) =>
          e.map((ee, xIndex) => (
            <div
              key={`${xIndex}${yIndex}`}
              className={classNames('matrix-grid', { 'matrix-grid__move-point': ee.isMovePoint })}
              onClick={matrixGridClick.bind(null, xIndex, yIndex)}
            >
              {!ee.isMovePoint && ee.showContent}
            </div>
          ))
        )}
      </div>
      <div className='console'>
        <Form.Item label='宫格大小'>
          <Input
            value={matrix.size.width}
            onChange={matrixSizeChange}
            style={{ marginLeft: '5px' }}
          />
        </Form.Item>
        <Button onClick={restart}>重新开始</Button>
        <Button onClick={start}>开始</Button>
        计时：{hasBegunTime.seconds}s
      </div>
    </div>
  )

  function start(): void {
    if (matrix.isStart) {
      message.warning('您已经开始了，请勿瞎操作…')
      return
    }

    setMatrix(state => ({
      ...state,
      isStart: true,
      source: upsetMatrixSource(state.source),
    }))

    startTimekeeping()
  }
  function restart(): void {
    setMatrix(state => ({
      ...state,
      source: upsetMatrixSource(state.source),
    }))
    clearInterval(hasBegunTime.timer!)
    startTimekeeping()
  }

  function startTimekeeping(): void {
    const hasBegunTimer = setInterval(() => {
      setHasBegunTime(state => ({
        ...state,
        seconds: state.seconds + 1,
      }))
    }, 1000)

    setHasBegunTime(state => ({
      ...state,
      seconds: 0,
      timer: hasBegunTimer,
    }))
  }

  function matrixSizeChange(el): void {
    el.persist()
    const value = +el.target.value
    setMatrix(state => {
      state.size = {
        width: value,
        height: value,
      }
      state.source = initMatrixSource(state.size)
      return { ...state }
    })
  }

  function matrixGridClick(clickXIndex: number, clickYIndex: number): void {
    if (!matrix.isStart) {
      message.warn('麻烦你开始游戏先啦')
      return
    }

    const { source: matrixSource } = matrix
    const movePointIndex = getMovePointIndex()

    if (isMatrixMove()) {
      exchangeMatrixGrid()
      if (verifCorrect()) {
        message.success(`恭喜你完成啦，耗时${hasBegunTime.seconds}s`)
        clearInterval(hasBegunTime.timer!)
      }
    }

    setMatrix(state => ({
      ...state,
      source: matrixSource,
    }))

    function verifCorrect(): boolean {
      let previousId = 0
      return matrixSource.every(e =>
        e.every(ee => {
          previousId++
          return ee.id === previousId
        })
      )
    }

    function exchangeMatrixGrid(): void {
      const { x: movePointX, y: movePointY } = movePointIndex
      ;[matrixSource[movePointY][movePointX], matrixSource[clickYIndex][clickXIndex]] = [
        matrixSource[clickYIndex][clickXIndex],
        matrixSource[movePointY][movePointX],
      ]
    }

    function isMatrixMove(): boolean {
      const { x, y } = movePointIndex
      return (
        ([y + 1, y - 1].includes(clickYIndex) && x === clickXIndex) ||
        ([x + 1, x - 1].includes(clickXIndex) && y === clickYIndex)
      )
    }
  }

  function initMatrixSource(matrixSize: Matrix.State['size']): Matrix.State['source'] {
    const matrixSource: Matrix.State['source'] = []
    const { height: matrixH, width: matrixW } = matrixSize ?? matrix.size
    let id = 0
    for (let i = 0; i < matrixH; i++) {
      matrixSource[i] = []
      for (let ii = 0; ii < matrixW; ii++) {
        id++
        const matrixGrid: Matrix.Source = { id, showContent: id, isMovePoint: false }
        if (i === matrixH - 1 && ii === matrixW - 1) {
          matrixGrid.isMovePoint = true
        }
        matrixSource[i].push(matrixGrid)
      }
    }
    return matrixSource
  }

  function upsetMatrixSource<T = Matrix.State['source']>(matrixSource: T): T {
    let { x: movePointX, y: movePointY } = getMovePointIndex()
    const { width: matrixW, height: matrixH } = matrix.size

    // eslint-disable-next-line
    let previous5Step: string[] = []
    for (let i = 0; i < 10000; i++) {
      // eslint-disable-next-line
      const mayMobileIndexs: string[] = getMayMobileIndexs().filter(
        // eslint-disable-next-line
        xyStr => !previous5Step.includes(xyStr)
      )
      while (true) {
        if (mayMobileIndexs.length === 0) {
          previous5Step = []
          break
        }
        const randomNum = ~~(Math.random() * mayMobileIndexs.length)
        let [x, y] = mayMobileIndexs[randomNum].split(',') as any as number[]
        x = +x
        y = +y
        const xyStr: string = `${x},${y}`
        if (previous5Step.length === 5) {
          previous5Step = []
          exchangeMatrixGrid()
          break
        } else if (!previous5Step.includes(xyStr)) {
          previous5Step.push(xyStr)
          exchangeMatrixGrid()
          break
        }

        // eslint-disable-next-line
        function exchangeMatrixGrid(): void {
          ;[matrixSource[y][x], matrixSource[movePointY][movePointX]] = [
            matrixSource[movePointY][movePointX],
            matrixSource[y][x],
          ]
          movePointX = x
          movePointY = y
        }
      }
    }
    return matrixSource

    function getMayMobileIndexs(): string[] {
      const mayMobileindexs: string[] = []
      if (movePointX - 1 !== -1) {
        mayMobileindexs.push(`${movePointX - 1},${movePointY}`)
      }
      if (movePointX + 1 <= matrixW - 1) {
        mayMobileindexs.push(`${movePointX + 1},${movePointY}`)
      }
      if (movePointY - 1 !== -1) {
        mayMobileindexs.push(`${movePointX},${movePointY - 1}`)
      }
      if (movePointY + 1 <= matrixH - 1) {
        mayMobileindexs.push(`${movePointX},${movePointY + 1}`)
      }
      return mayMobileindexs
    }
  }

  function getMovePointIndex(): { x: number; y: number } {
    let x, y
    matrix.source.some((e, yIndex) => {
      return e.some((ee, xIndex) => {
        if (ee.isMovePoint) {
          x = xIndex
          y = yIndex
          return true
        }
        return false
      })
    })
    return { x, y }
  }
}

export default PushSquare
