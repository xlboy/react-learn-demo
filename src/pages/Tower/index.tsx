import React, { useState } from 'react'
import './index.less'
import { Tower } from './typings'
import { Button, message, notification } from 'antd'
import classNames from 'classnames'

type GridClass = ('' | 'success-move' | 'error-move')[]
let downTowerGridIndex: null | number = null
let moveGridBlockTarget: Tower.Block | null = null
function Tower_(): JSX.Element {
  const [blockNum] = useState<number>(() => {
    let blockNum = +prompt('请问要多少个块？仅允许填3-5范围的数字，如若填错则默认取3')
    if (!(blockNum < 6 && blockNum > 2)) {
      blockNum = 3
    }
    return blockNum
  })
  const [state, setState] = useState<Tower.State>({
    towerSrouce: initTowerSrouce(),
    isVictory: false,
    countAction: 0,
  })
  const [gridClass, setGridClass] = useState<GridClass>(['', '', ''])
  return (
    <div className='tower'>
      <Button onClick={onReset}>重新开始</Button>
      <div className='tower-content'>
        {state.towerSrouce.map((grid, gIndex) => (
          <div
            className={classNames('tower-content-grid', gridClass[gIndex])}
            key={gIndex}
            onMouseMove={gridMouseMove.bind(null, gIndex, grid)}
            onMouseUp={gridMouseUp.bind(null, gIndex, grid)}
          >
            <div className='pillar'>
              {grid.blocks.map((block, bIndex) => (
                <div
                  key={bIndex}
                  className={classNames(
                    'pillar-block',
                    `block-level-${block.size || JSON.stringify(block)}`
                  )}
                  onMouseDown={gridBlockMouseDown.bind(null, gIndex, bIndex, block)}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
  function onReset(): void {
    setState({
      towerSrouce: initTowerSrouce(),
      isVictory: false,
      countAction: 0,
    })
  }

  function gridMouseMove(gridIndex: number, grid: Tower.Srouce): void {
    if (moveGridBlockTarget !== null) {
      const { topBlock } = grid
      const isMeetMoveCondition =
        gridIndex !== downTowerGridIndex &&
        (topBlock === null || topBlock.size > moveGridBlockTarget.size)

      const _gridClass: GridClass = ['', '', '']
      _gridClass[gridIndex] = isMeetMoveCondition ? 'success-move' : 'error-move'

      if (JSON.stringify(_gridClass) !== JSON.stringify(gridClass)) {
        setGridClass(_gridClass)
      }
    }
  }

  function gridMouseUp(gridIndex: number, grid: Tower.Srouce): void {
    if (moveGridBlockTarget !== null) {
      const { topBlock } = grid
      const isMeetMoveCondition =
        gridIndex !== downTowerGridIndex &&
        (topBlock === null || topBlock.size > moveGridBlockTarget.size)
      if (isMeetMoveCondition) {
        const { towerSrouce, countAction } = state
        const towerUpSrouce = towerSrouce[gridIndex]
        const towerDownSrouce = towerSrouce[downTowerGridIndex]
        towerUpSrouce.topBlock = moveGridBlockTarget
        towerUpSrouce.blocks.unshift(moveGridBlockTarget)
        towerDownSrouce.blocks.shift()
        if (towerDownSrouce.blocks.length === 0) {
          towerDownSrouce.topBlock = null
        }
        const isVictory = towerSrouce[2].blocks.length === blockNum
        if (isVictory) {
          notification.open({
            message: '提示',
            description: `获胜了，一共花了${countAction + 1}步`,
          })
        }
        setState(state => {
          return {
            ...state,
            countAction: countAction + 1,
            isVictory,
            towerSrouce,
          }
        })
      } else {
        message.warn('条件不符')
      }
      moveGridBlockTarget = null
    }
    setGridClass(['', '', ''])
  }

  function gridBlockMouseDown(gridIndex: number, blockIndex: number, block: Tower.Block): void {
    const { towerSrouce, isVictory } = state
    if (isVictory) {
      message.warn('已胜利，重新开始吧！')
      return
    }
    if (towerSrouce[gridIndex].blocks.length !== 1 && blockIndex !== 0) {
      message.warn('请移最上方的圈圈')
    } else {
      moveGridBlockTarget = block
      downTowerGridIndex = gridIndex
    }
  }

  function initTowerSrouce(): Tower.State['towerSrouce'] {
    const towerSrouce: Tower.State['towerSrouce'] = []
    for (let i = 0; i < 3; i++) {
      towerSrouce.push({
        topBlock: null,
        blocks: [],
      })
    }
    towerSrouce[0].blocks = new Array(blockNum).fill('').map((_, i) => ({ size: i + 1 }))
    return towerSrouce
  }
}

export default Tower_
