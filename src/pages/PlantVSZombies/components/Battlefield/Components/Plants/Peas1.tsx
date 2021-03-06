import React, { CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { Battlefield } from '@/pages/PlantVSZombies/typings/battlefield'
import gameController from '@/pages/PlantVSZombies/core/gameController'
import useAddRemoveActiveContent, {
  AddRemoveActiveContentType,
} from '@/pages/PlantVSZombies/core/gameController/useAddRemoveActiveContent'
import allPlantConfig, { PlantConfig } from '@/pages/PlantVSZombies/core/configs/allPlantConfig'
import {
  ActiveContent,
  ActiveType,
  CollideType,
  SwapType,
} from '@/pages/PlantVSZombies/typings/gameController'
import { Plant } from '@/pages/PlantVSZombies/typings/plant'
import { observer, useLocalStore, useObserver } from 'mobx-react'

interface Peas1Props extends Battlefield.PropsBase {}
const plantName = '豌豆射手1'
interface PlantBase {
  defenseValue: number
  isAttack: boolean
  hurtValue: number
  /**上一次攻击的时间 */
  attackTime: number | null
}

function Peas1(props: Peas1Props): JSX.Element {
  const {
    positionStyle,
    battlefieldElRef,
    removePlant,
    plantHpContextRef,
    plantMessageContextRef,
  } = props

  type Skill = (...args: any) => React.ReactPortal
  const [skills, setSkills] = useState<Skill[]>([LaunchBullet])
  const [isAttack, setIsAttack] = useState(false)

  const plantConfig = useMemo<PlantConfig<Plant.Type.Attack>>(
    () => allPlantConfig.find(item => item.name === plantName) as PlantConfig<Plant.Type.Attack>,
    []
  )

  const [, removePlantTag] = useMemo<AddRemoveActiveContentType>(() => {
    return useAddRemoveActiveContent({
      ...positionStyle,
      type: ActiveType.Plant,
      content: plantConfig as PlantConfig,
      collideCallback: plantCollideCallback,
      swapCallback: plantSwapCallback,
    })
  }, [])

  const plantBase: PlantBase = {
    defenseValue: plantConfig.content.content.defenseValue,
    isAttack: false,
    hurtValue: plantConfig.content.content.hurtValue,
    attackTime: null,
  }

  return (
    <>
      <img src={require('@/assets/images/plant_vs_zombies/pic_peas_1.gif')} />
      {isAttack && skills.map((Component, index) => <Component key={index} />)}
    </>
  )

  function LaunchBullet(): React.ReactPortal {
    plantBase.attackTime = +new Date()
    const attackSpeed = plantConfig.content.content.attackSpeed * 1000
    const [, removeSkillTag, updateSkillPosition]: AddRemoveActiveContentType =
      useAddRemoveActiveContent({
        ...positionStyle,
        type: ActiveType.Skill,
        content: { hurtValue: plantBase.hurtValue },
        collideCallback: skillCollideCallback,
      })
    return ReactDOM.createPortal(<Component />, battlefieldElRef.current)

    function Component(): JSX.Element {
      const imgRef = useRef<HTMLImageElement>()
      const positionLT = {
        left: `${parseInt(positionStyle.left) + 20}px`,
        top: `${parseInt(positionStyle.top) + 20}px`,
      }
      useEffect(() => {
        ;(function animationLoop() {
          if (imgRef.current !== null) {
            positionLT.left = `${parseInt(positionLT.left) + 15}px`
            imgRef.current.style.left = positionLT.left
            updateSkillPosition(positionLT.left, positionLT.top)
            // 检测子弹是否超出地图了，若超出了则重新发射
            if (parseInt(positionLT.left) > 1160) {
              removeSkillTag()
              againAttack()
            }
            requestAnimationFrame(animationLoop)
          }
        })()
        // 确保在组件销毁前能清除Skill在ActiveContent里的位置
        return function destroySkillContent() {
          Promise.resolve().then(() => removeSkillTag())
        }
      }, [])

      const style: CSSProperties = {
        position: 'absolute',
        zIndex: 3,
        ...positionLT,
      }
      return (
        <img
          ref={imgRef}
          src={require('@/assets/images/plant_vs_zombies/pic_peas_bullet.gif')}
          style={style}
        />
      )
    }

    function againAttack(): void {
      const attackInterval = +new Date() - plantBase.attackTime
      if (attackInterval > attackSpeed) {
        setSkills(state => [])
        setTimeout(() => {
          setSkills(state => [...state])
        })
      } else {
        setSkills(state => [])
        setTimeout(() => {
          setSkills(state => [LaunchBullet])
        }, attackSpeed - attackInterval)
      }
    }

    function skillCollideCallback(
      collideType: CollideType,
      collideTarget: ActiveContent,
      collideSrouce: ActiveContent
    ): void {
      if (collideSrouce.type === ActiveType.Skill) {
        if (collideType === CollideType.XYAxleCollide) {
          switch (collideTarget.type) {
            case ActiveType.Zombie:
              removeSkillTag()
              againAttack()
              return
          }
        }
      }
    }
  }

  function plantCollideCallback(collideType: CollideType, collideTarget: ActiveContent) {
    switch (collideType) {
      case CollideType.AttackRange:
        // 是否在攻击范围，并且当前不处于攻击状态
        if (!plantBase.isAttack) {
          plantBase.isAttack = true
          setIsAttack(true)
        }
        return
      case CollideType.NotAttackRange:
        if (plantBase.isAttack) {
          plantBase.isAttack = false
          setIsAttack(false)
        }
        return
      case CollideType.XYAxleCollide:
        console.log('碰起来了碰起来了')
    }
  }

  function plantSwapCallback(swapType: SwapType, swapTarget: ActiveContent): void {
    switch (swapType) {
      case SwapType.NowAttack:
        if (swapTarget.type === ActiveType.Zombie) {
          // 避免植物死后，还受到了僵尸的攻击
          if (plantBase.defenseValue <= 0) return
          const initHp = plantConfig.content.content.defenseValue
          plantMessageContextRef.current.setMessage('…老子打不死你')
          const { hurtValue } = swapTarget.content.content.content
          plantBase.defenseValue -= hurtValue
          plantHpContextRef.current.updateHp(`${(plantBase.defenseValue / initHp) * 100}%`)
          if (plantBase.defenseValue <= 0) {
            removePlantTag()
            removePlant()
          }
        }
        return
    }
  }
}

export default Peas1
