import gameController from '@/pages/PlantVSZombies/core/gameController'
import useAddRemoveActiveContent from '@/pages/PlantVSZombies/core/gameController/useAddRemoveActiveContent'
import {
  ActiveContent,
  ActiveTarget,
  ActiveType,
  CollideType,
  SwapType,
} from '@/pages/PlantVSZombies/typings/gameController'
import { Zombie } from '@/pages/PlantVSZombies/typings/zombie'
import React, {
  CSSProperties,
  Dispatch,
  SetStateAction,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import ReactDOM from 'react-dom'
interface OrdinaryZombieProps extends Zombie.PropsBase {}
interface ZombieBase {
  defenseValue: number
  isAttack: boolean
  /* 在碰撞后，可能还会在碰撞元素内部进行移动，而移动的途中会不停的触发回调，用此数据来判断回调 */
  isCollide: boolean
  isDeath: boolean
  attackTimer: NodeJS.Timeout | null
}
function OrdinaryZombie(props: OrdinaryZombieProps): JSX.Element {
  const { positionStyle, battlefieldRef, removeZombie, zombieConfig } = props
  let previousPosition: Zombie.PropsBase['positionStyle'] = { ...positionStyle }
  const zombieBase: ZombieBase = {
    defenseValue: zombieConfig.content.content.defenseValue,
    isAttack: false,
    isCollide: false,
    isDeath: false,
    attackTimer: null,
  }

  const [, removeZombieTag, updateActiveContentPosition] = useAddRemoveActiveContent({
    ...positionStyle,
    type: ActiveType.Zombie,
    content: { ...zombieConfig },
    collideCallback: zombieCollideCallback,
    swapCallback: zombieSwapCallback,
  })

  return (
    <>
      <ZombieComponent />
    </>
  )

  function ZombieComponent(): React.ReactPortal {
    const { moveSpeed, defenseValue: initHp } = zombieConfig.content.content
    const Component = () => {
      const zombieRef = useRef<HTMLDivElement>()
      const zombieHpRef = useRef<HTMLDivElement>()
      useEffect(() => {
        ;(function animationLoop() {
          if (!zombieBase.isDeath && zombieRef.current) {
            if (!zombieBase.isAttack) {
              previousPosition.left = `${parseInt(previousPosition.left) + -2}px`
              zombieRef.current.style.left = previousPosition.left
              zombieRef.current.classList.remove('zombie-attack')
            } else if (zombieRef.current.className.indexOf('zombie-attack') === -1) {
              zombieRef.current.classList.add('zombie-attack')
            }
            zombieHpRef.current.style.width = `${(zombieBase.defenseValue / initHp) * 100}%`
            updateActiveContentPosition(previousPosition.left, previousPosition.top)
            setTimeout(() => {
              requestAnimationFrame(animationLoop)
            }, moveSpeed * 100)
          }
        })()

        return function destroyZombieContent() {
          Promise.resolve().then(() => removeZombieTag())
        }
      }, [])

      return (
        <div ref={zombieRef} className='zombie-grid' style={positionStyle}>
          <img
            src={zombieConfig.image}
            style={{ transform: `scale(${zombieConfig.zoomIndex || 1.2})` }}
          />
          <div className='zombie-hp'>
            <div className='hp-fill' ref={zombieHpRef}></div>
          </div>
        </div>
      )
    }

    return ReactDOM.createPortal(<Component />, battlefieldRef.current)
  }

  function zombieCollideCallback(
    collideType: CollideType,
    collideTarget: ActiveContent,
    collideSrouce: ActiveContent
  ): void {
    if (collideType === CollideType.XYAxleCollide) {
      if (!zombieBase.isCollide) {
        zombieBase.isCollide = true
        setTimeout(() => {
          zombieBase.isCollide = false
        }, 100)
        switch (collideTarget.type) {
          case ActiveType.Skill:
            zombieBase.defenseValue -= collideTarget.content.hurtValue
            // 僵尸没血了，送走轮回
            if (zombieBase.defenseValue <= 0) {
              zombieBase.isDeath = true
              removeZombieTag()
              removeZombie()
            }
            return
          case ActiveType.Plant:
            const { attackSpeed } = zombieConfig.content.content
            zombieBase.isAttack = true
            zombieBase.attackTimer = setInterval(() => {
              // 定时，打植物，打残它
              collideTarget.swapCallback(SwapType.NowAttack, collideSrouce)
            }, attackSpeed * 1000)
            return
        }
      }
    } else if (collideType === CollideType.NotXYAxleCollide) {
      zombieBase.isAttack = false
    }
  }

  function zombieSwapCallback(swapType: SwapType, swapTarget: ActiveContent): void {}
}

export default OrdinaryZombie
