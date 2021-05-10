import { message, Form, Input, Button } from 'antd'
import React, { useState } from 'react'
import './index.less'

const PushSquare = () => {
    const initMatrixSize = {
        width: 3,
        height: 3
    }
    const [matrix, setMatrix] = useState({
        size: { ...initMatrixSize },
        source: initMatrixSource(initMatrixSize),
        isStart: false
    })
    const [hasBegunTime, setHasBegunTime] = useState({
        timer: null,
        seconds: 0,
    })
    return (
        <div className='push-square'>
            <div className='matrix' style={{ width: matrix.size.width * 100 }}>
                {
                    matrix.source.map((e, yIndex) => {
                        return e.map((ee, xIndex) => {
                            return (
                                <div
                                    key={`${xIndex}${yIndex}`}
                                    className={['matrix-grid', ee.isMovePoint ? 'matrix-grid-move-point' : ''].join(' ')}
                                    onClick={matrixGridClick.bind(null, xIndex, yIndex)}>
                                    {!ee.isMovePoint && ee.showContent}
                                </div>
                            )
                        })
                    })
                }
            </div>
            <div className='console'>
                <Form.Item label="宫格大小->宽" >
                    <Input value={matrix.size.width} onChange={matrixSizeChange.bind(null, 'width')} />
                </Form.Item>
                <Form.Item label="宫格大小->高" >
                    <Input value={matrix.size.height} onChange={matrixSizeChange.bind(null, 'height')} />
                </Form.Item>
                <Button onClick={restart}>重新开始</Button>
                <Button onClick={start}>开始</Button>
                计时：{hasBegunTime.seconds}s
            </div>

        </div>
    )

    function start() {
        if (matrix.isStart) {
            return message.warning('您已经开始了，请勿瞎操作…')
        }

        setMatrix(state => ({
            ...state,
            isStart: true,
            source: upsetMatrixSource(state.source)
        }))

        startCalculateTimer()

    }

    function restart() {
        setMatrix(state => ({
            ...state,
            source: upsetMatrixSource(state.source)
        }))
        clearInterval(hasBegunTime.timer)
        startCalculateTimer()
    }

    function startCalculateTimer() {
        const hasBegunTimer = setInterval(() => {
            setHasBegunTime(state => ({
                ...state,
                seconds: state.seconds + 1
            }))
        }, 1000)

        setHasBegunTime(state => ({
            seconds: 0,
            timer: hasBegunTimer
        }))
    }

    function matrixSizeChange(key, e) {
        e.persist();
        setMatrix(state => {
            state.size[key] = +e.target.value
            state.source = initMatrixSource(state.size)
            return { ...state }
        })
    }

    function matrixGridClick(clickXIndex, clickYIndex) {
        const { source: matrixSource } = matrix
        const movePointIndex = getMovePointIndex()

        if (isMatrixMove()) {
            exchangeMatrixGrid()
            if (verifCorrect()) {
                message.success(`恭喜你完成啦，耗时${hasBegunTime.seconds}s`)
                clearInterval(hasBegunTime.timer)
            }
        }

        setMatrix(state => ({
            ...state,
            source: matrixSource
        }))

        function verifCorrect() {
            let previousId = 0
            return matrixSource.every(e => {
                return e.every(ee => {
                    previousId++
                    return ee.id === previousId
                })
            })
        }

        function exchangeMatrixGrid() {
            const { x: movePointX, y: movePointY } = movePointIndex;
            ;[
                matrixSource[movePointY][movePointX],
                matrixSource[clickYIndex][clickXIndex]
            ] = [
                    matrixSource[clickYIndex][clickXIndex],
                    matrixSource[movePointY][movePointX],
                ]
        }

        function isMatrixMove() {
            const { x, y } = movePointIndex
            return (
                ([y + 1, y - 1].includes(clickYIndex) && x === clickXIndex) ||
                ([x + 1, x - 1].includes(clickXIndex) && y === clickYIndex)
            )
        }
    }

    function initMatrixSource(matrixSize) {
        const matrixSource = []
        const { height: matrixH, width: matrixW } = matrixSize ?? matrix.size
        let id = 0
        for (let i = 0; i < matrixH; i++) {
            matrixSource[i] = []
            for (let ii = 0; ii < matrixW; ii++) {
                id++
                const matrixGrid = { id, showContent: id, isMovePoint: false }
                if (i === matrixH - 1 && ii === matrixW - 1) {
                    matrixGrid.isMovePoint = true
                }
                matrixSource[i].push(matrixGrid)
            }
        }
        return matrixSource
    }

    function upsetMatrixSource(matrixSource) {
        let { x: movePointX, y: movePointY } = getMovePointIndex()
        const { width: matrixW, height: matrixH } = matrix.size

        let previous5Step = []
        for (let i = 0; i < 10000; i++) {
            const mayMobileIndexs = getMayMobileIndexs().filter(xyStr => !previous5Step.includes(xyStr))
            while (true) {
                if (mayMobileIndexs.length === 0) {
                    previous5Step = []
                    break;
                }
                const randomNum = ~~(Math.random() * mayMobileIndexs.length)
                let [x, y] = mayMobileIndexs[randomNum].split(',')
                x = +x
                y = +y
                const xyStr = `${x},${y}`
                if (previous5Step.length === 5) {
                    previous5Step = []
                    exchangeMatrixGrid()
                    break;
                } else if (!previous5Step.includes(xyStr)) {
                    previous5Step.push(xyStr)
                    exchangeMatrixGrid()
                    break;
                }

                function exchangeMatrixGrid() {
                    ;[
                        matrixSource[y][x],
                        matrixSource[movePointY][movePointX]
                    ] = [
                            matrixSource[movePointY][movePointX],
                            matrixSource[y][x],
                        ]
                    movePointX = x
                    movePointY = y
                }

            }

        }
        return matrixSource

        function getMayMobileIndexs() {
            const mayMobileindexs = []
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

    function getMovePointIndex() {
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
