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

        function getMovePointIndex() {
            let x, y
            matrixSource.some((e, yIndex) => {
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
        const { height, width } = matrixSize ?? matrix.size
        let id = 0
        for (let i = 0; i < height; i++) {
            matrixSource[i] = []
            for (let ii = 0; ii < width; ii++) {
                id++
                const matrixGrid = { id, showContent: id, isMovePoint: false }
                if (i === height - 1 && ii === width - 1) {
                    matrixGrid.isMovePoint = true
                }
                matrixSource[i].push(matrixGrid)
            }
        }
        return matrixSource
    }

    function upsetMatrixSource(matrixSource) {
        const upsetTarget = [...matrixSource]
            .flat(Infinity)
            .sort(() => 0.5 - Math.random())
        const result = []

        const { height, width } = matrix.size
        let id = 0;
        for (let i = 0; i < height; i++) {
            result[i] = []
            for (let ii = 0; ii < width; ii++) {
                result[i].push(upsetTarget[id])
                id++
            }
        }

        return result
    }
}

export default PushSquare
