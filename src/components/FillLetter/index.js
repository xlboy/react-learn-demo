import React, { useState } from 'react'
import wordSrouce from './model/wordSrouce'
import { Tag, Input, Button, message } from 'antd';
import './index.less'
const FillLetter = () => {
    const [state, setState] = useState({
        topicIndex: 0,
        wordLetters: generateWordLetters(0)
    })
    return (
        <div className='fill-letter__wrap'>
            <h3>当前已答题目数为: {state.topicIndex}</h3>
            {
                state.wordLetters.map((e, i) =>
                    e.isFill ?
                        <Input key={i} maxLength={1} value={e.value} onChange={topicFillChange.bind(null, i)} /> :
                        <Tag key={i} color="#2db7f5">{e.letter}</Tag>
                )
            }
            <Button type="primary" onClick={topicFillReset}>reset</Button>
        </div>
    )

    function topicFillReset() {
        setState(state => {
            return {
                ...state,
                wordLetters: state.wordLetters.map(e => {
                    if (e.isFill) e.value = ''
                    return e
                })
            }
        })
    }

    function topicFillChange(index, e) {
        e.persist();
        const wordLetters = JSON.parse(JSON.stringify(state.wordLetters))
        wordLetters[index].value = e.target.value
        setState(state => {
            return {
                ...state,
                wordLetters
            }
        })

        const isSuccess = wordLetters.map(e => e.letter === e.value).includes(false)
        if (!isSuccess) {
            const newTopicIndex = state.topicIndex + 1

            if (newTopicIndex === wordSrouce.length) {
                message.warning('没题啦~请重新开始')
            } else {
                message.success('正确~!即将进入下一题')
                setTimeout(() => {
                    setState(state => {
                        return {
                            topicIndex: newTopicIndex,
                            wordLetters: generateWordLetters(newTopicIndex)
                        }
                    })
                }, 600);
            }
        }

    }

    function generateWordLetters(topicIndex, generateLength = 3) {
        const word = wordSrouce[topicIndex]
        const generateIndexs = (() => {
            let cycleIndex = 0
            const indexs = []

            while (true) {
                const index = ~~(Math.random() * word.length - 1)
                if (cycleIndex === generateLength) {
                    break;
                } else if (!indexs.includes(index)) {
                    indexs.push(index)
                    cycleIndex++
                }
            }

            return indexs
        })();
        const target = word.split('').map((letter, index) => {
            const isFill = generateIndexs.includes(index)
            const value = isFill ? '' : letter
            return { letter, isFill, value }
        })
        return target
    }

}
export default FillLetter