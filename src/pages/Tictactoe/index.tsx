import { Button, Form, Input, notification } from 'antd'
import React from 'react'
import { useState } from 'react'
import './index.less'
import { Tictactoe } from './typings'

function Tictactoe_(): JSX.Element {
  const [state, setState] = useState<Tictactoe.State>({
    currentPlayer: true,
    victoryPlayer: null,
    martixGridSize: 3,
    martixSource: initMatrixSource(3),
  })

  return (
    <div className='tictactoe'>
      <Form.Item label='棋盘大小'>
        <Input
          value={state.martixGridSize}
          onChange={matrixSizeChange}
          style={{ marginLeft: '5px' }}
        />
      </Form.Item>
      <div className='tictactoe-head'>
        <Button onClick={onReset}>重新开始</Button>
        {state.victoryPlayer === null && (
          <div className='tictactoe-head__hint'>
            请{formatCurrentPlayer(state.currentPlayer)}方出棋
          </div>
        )}
      </div>
      <div
        className='tictactoe-matrix'
        style={{
          width: `${state.martixGridSize * 100}px`,
          height: `${state.martixGridSize * 100}px`,
        }}
      >
        {state.martixSource.map((yAxis, yIndex) =>
          yAxis.map((xItem, xIndex) => {
            const classNameComputed = (() => {
              const classList = ['tictactoe-matrix__grid']
              if (xItem.player === null) {
                classList.push(state.currentPlayer ? 'bg-pink' : 'bg-purple')
              }
              return classList.join(' ')
            })()

            return (
              <div
                className={classNameComputed}
                key={`${yIndex}-${xIndex}`}
                onClick={martixGridClick.bind(null, xItem, yIndex, xIndex)}
              >
                {formatCurrentPlayer(xItem.player)}
              </div>
            )
          })
        )}
      </div>
    </div>
  )

  function matrixSizeChange(el): void {
    el.persist()
    const value = +el.target.value
    setState(state => ({
      ...state,
      martixGridSize: value,
      martixSource: initMatrixSource(value),
    }))
  }

  function onReset(): void {
    setState(state => {
      return {
        ...state,
        currentPlayer: true,
        victoryPlayer: null,
        martixSource: initMatrixSource(state.martixGridSize),
      }
    })
  }

  function martixGridClick(xItem: Tictactoe.MartixGrid, yIndex: number, xIndex: number): void {
    if (xItem.player === null && state.victoryPlayer === null) {
      const { currentPlayer, martixSource } = state
      martixSource[yIndex][xIndex].player = currentPlayer

      const isPlayerVictory = verifPlayerVictory(currentPlayer, martixSource)
      if (isPlayerVictory) {
        setState(state => ({
          ...state,
          victoryPlayer: currentPlayer,
        }))

        const victoryPlayerStr = formatCurrentPlayer(currentPlayer)
        const totalGridNum = computedPlayerTotalGrid(currentPlayer, martixSource)
        notification.open({
          message: '提示',
          description: `恭喜${victoryPlayerStr}方获胜，总共出了${totalGridNum}步`,
          duration: null,
        })
      } else if (verifAllContent(martixSource)) {
        setState(state => ({
          ...state,
          victoryPlayer: 1,
        }))
      }

      setState(state => ({
        ...state,
        currentPlayer: !currentPlayer,
        martixSource,
      }))
    }

    function verifPlayerVictory(
      currentPlayer: Tictactoe.State['currentPlayer'],
      martix: Tictactoe.State['martixSource']
    ): boolean {
      const matrixGridSize = state.martixGridSize
      return verifMode1() || verifMode2() || verifMode3()

      // 横向的检测
      function verifMode1(): boolean {
        for (let y = 0; y < matrixGridSize; y++) {
          let count = 0
          for (let x = 0; x < matrixGridSize; x++) {
            if (martix[y][x].player === currentPlayer) count++
            if (count === matrixGridSize) return true
          }
        }
        return false
      }

      // 竖向检测
      function verifMode2(): boolean {
        for (let y = 0; y < matrixGridSize; y++) {
          let count = 0
          for (let x = 0; x < matrixGridSize; x++) {
            martix[x][y].player === currentPlayer && count++
            if (count === matrixGridSize) return true
          }
        }
        return false
      }

      // 检测斜的方式
      function verifMode3(): boolean {
        let count = 0
        for (let i = 0; i < matrixGridSize; i++) {
          if (martix[i][i].player === currentPlayer) count++
          if (count === matrixGridSize) return true
        }
        count = 0
        for (let i = matrixGridSize - 1, i2 = 0; i >= 0; i--, i2++) {
          if (martix[i2][i].player === currentPlayer) count++
          if (count === matrixGridSize) return true
        }
        return false
      }
    }

    function verifAllContent(martix: Tictactoe.State['martixSource']): boolean {
      let count = 0
      const { martixGridSize } = state
      martix.forEach(y => {
        y.forEach(xItem => {
          xItem.player !== null && count++
        })
      })
      return count === martixGridSize * martixGridSize
    }
  }

  function computedPlayerTotalGrid(
    victoryPlayer: Tictactoe.State['victoryPlayer'],
    martix: Tictactoe.State['martixSource']
  ): number {
    let count = 0
    if (victoryPlayer !== null) {
      martix.forEach(y => {
        y.forEach(xItem => {
          xItem.player === victoryPlayer && count++
        })
      })
    }
    return count
  }

  function formatCurrentPlayer(player: Tictactoe.State['victoryPlayer']): string {
    if (player !== null) {
      return player ? 'O' : 'X'
    }
    return ''
  }

  function initMatrixSource(size: number): Tictactoe.State['martixSource'] {
    const matrix: Tictactoe.State['martixSource'] = []
    for (let i = 0; i < size; i++) {
      matrix[i] = []
      for (let i2 = 0; i2 < size; i2++) {
        matrix[i].push({
          player: null,
        })
      }
    }
    return matrix
  }
}

export default Tictactoe_
