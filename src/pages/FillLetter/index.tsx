import React, { useState } from 'react'
import wordSrouce from './model/wordSrouce'
import { Tag, Input, Button, message } from 'antd'
import './index.less'
import { WordLetter } from './typings'

interface FillLetterState {
  topicIndex: number
  wordLetters: WordLetter[]
}

function FillLetter(): JSX.Element {
  const [state, setState] = useState<FillLetterState>({
    topicIndex: 0,
    wordLetters: generateWordLetters(0),
  })

  return (
    <div className='fill-letter'>
      <h3 style={{ color: '#FFFFFF' }}>当前已答题目数为: {state.topicIndex}</h3>
      <Letters />

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        <Button type='primary' onClick={topicFillReset}>
          reset
        </Button>
      </div>
    </div>
  )

  function Letters(): JSX.Element {
    const { wordLetters } = state
    return (
      <>
        {wordLetters.map((item, index) => {
          const { isFill, value, letter } = item
          return isFill ? (
            <Input
              key={index}
              maxLength={1}
              value={value}
              onChange={topicFillChange.bind(null, index)}
            />
          ) : (
            <Tag key={index} color='#2db7f5'>
              {letter}
            </Tag>
          )
        })}
      </>
    )

    function topicFillChange(index: number, el): void {
      el.persist()
      const wordLetters: WordLetter[] = JSON.parse(JSON.stringify(state.wordLetters))
      wordLetters[index].value = el.target.value
      setState(state => ({
        ...state,
        wordLetters,
      }))

      const isSuccess: boolean = wordLetters.map(e => e.letter === e.value).includes(false)
      if (!isSuccess) {
        const newTopicIndex: number = state.topicIndex + 1

        if (newTopicIndex === wordSrouce.length) {
          message.warning('没题啦~请重新开始')
        } else {
          message.success('正确~!即将进入下一题')
          setTimeout(() => {
            setState(state => ({
              ...state,
              topicIndex: newTopicIndex,
              wordLetters: generateWordLetters(newTopicIndex),
            }))
          }, 600)
        }
      }
    }
  }

  function topicFillReset(): void {
    setState(state => ({
      ...state,
      wordLetters: state.wordLetters.map(e => {
        e.isFill && (e.value = '')
        return e
      }),
    }))
  }

  function generateWordLetters(topicIndex: number, generateLength = 3): WordLetter[] {
    const word: string = wordSrouce[topicIndex]
    const generateIndexs: number[] = (() => {
      let cycleIndex = 0
      const indexs: number[] = []

      while (true) {
        const index = ~~(Math.random() * word.length - 1)
        if (cycleIndex === generateLength) {
          break
        } else if (!indexs.includes(index)) {
          indexs.push(index)
          cycleIndex++
        }
      }

      return indexs
    })()

    const target: WordLetter[] = word.split('').map((letter, index) => {
      const isFill = generateIndexs.includes(index)
      const value = isFill ? '' : letter
      return { letter, isFill, value }
    })
    return target
  }
}

export default FillLetter
