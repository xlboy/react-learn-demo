import { Tooltip } from 'antd'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import React from 'react'
import useStore from '../../core/store/useStore'
import './index.less'

function TopPlantSelect(): JSX.Element {
  const { plantCardList, sunNumber: storeSunNumber, setSunNumber } = useStore()
  return (
    <div className='top-plant-select'>
      <div
        className='sun-card'
        onClick={() => {
          setSunNumber(storeSunNumber + 50)
        }}
      >
        <img src={require('@/assets/images/plant_vs_zombies/pic_sun.gif')} alt='阳光图' />
        <div className='sun-card__number'>{storeSunNumber}</div>
      </div>
      <PlantCards />
    </div>
  )

  function PlantCards(): JSX.Element {
    const cardList = plantCardList.map(card => {
      const { image, name, sunNumber: cardSunNumber } = card
      const isBalanceIsEnough = storeSunNumber < cardSunNumber
      return (
        <Tooltip placement='bottom' title={name} key={name}>
          <div className={classNames('plant-card', { 'card-grey': isBalanceIsEnough })}>
            <img src={image} />
            <div className='plant-card__number'>{cardSunNumber}</div>
          </div>
        </Tooltip>
      )
    })
    return <>{cardList}</>
  }
}
export default observer(TopPlantSelect)
