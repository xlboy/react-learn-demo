import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { Battlefield } from '@/pages/PlantVSZombies/typings/battlefield'
import gameController from '@/pages/PlantVSZombies/core/gameController'
import useAddRemoveActiveContent from '@/pages/PlantVSZombies/core/gameController/useAddRemoveActiveContent'
import allPlantConfig from '@/pages/PlantVSZombies/core/configs/allPlantConfig'
import {
  ActiveContent,
  ActiveTypes,
  CollideType,
} from '@/pages/PlantVSZombies/typings/gameController'
import { Plant } from '@/pages/PlantVSZombies/typings/plant'
import { Attack } from '@/pages/PlantVSZombies/typings/plant/attack'
interface Peas1Props extends Battlefield.PropsBase {}
const plantName = '豌豆射手1'
interface PlantAttackBase {
  defenseValue: number
  isAttack: boolean
  hurtValue: number
}
function Peas1(props: Peas1Props): JSX.Element {
  const { positionStyle, battlefieldRef, clearPlant } = props
  type Skill = (...args: any) => React.ReactPortal
  const [skills, setSkills] = useState<Skill[]>([LaunchBullet])
  const [isAttack, setIsAttack] = useState(false)
  const [plantConfig] = useState(allPlantConfig.find(item => item.name === plantName))
  const plantAttackBase: PlantAttackBase = {
    defenseValue: plantConfig.content.content.defenseValue,
    isAttack: false,
    hurtValue: (plantConfig.content.content as Attack.Content).hurtValue,
  }
  const [, removePlantTag] = useAddRemoveActiveContent({
    ...positionStyle,
    type: ActiveTypes.Plant,
    content: plantConfig,
    collideCallback: plantCollideCallback,
  })

  return (
    <>
      <img src={require('@/assets/images/plant_vs_zombies/pic_peas_1.gif')} />
      {isAttack && skills.map((Component, index) => <Component key={index} />)}
    </>
  )

  function LaunchBullet(props: { index: number }): React.ReactPortal {
    const { index } = props
    const [, removeSkillTag, updateSkillPosition] = useAddRemoveActiveContent({
      ...positionStyle,
      type: ActiveTypes.Skill,
      content: { hurtValue: plantAttackBase.hurtValue },
      collideCallback: skillCollideCallback,
    })

    return ReactDOM.createPortal(<Component />, battlefieldRef.current)

    function Component(): JSX.Element {
      const style: CSSProperties = {
        position: 'absolute',
        left: `${parseInt(positionStyle.left) + 50}px`,
        top: `${parseInt(positionStyle.top) + 20}px`,
        zIndex: 3,
      }
      const imgRef = useRef<HTMLImageElement>()
      let previousPosition: Battlefield.PropsBase['positionStyle'] = { ...positionStyle }
      useEffect(() => {
        ;(function animloop() {
          if (imgRef.current !== null) {
            previousPosition.left = `${parseInt(previousPosition.left) + 15}px`
            imgRef.current.style.left = previousPosition.left
            updateSkillPosition(previousPosition.left, previousPosition.top)
            // 检测子弹是否超出地图了，若超出了则重新发射
            if (parseInt(previousPosition.left) > 1160) {
              setSkills(state => [...state])
            }
            requestAnimationFrame(animloop)
          }
        })()
      }, [])

      return (
        <img
          ref={imgRef}
          src={require('@/assets/images/plant_vs_zombies/pic_peas_bullet.gif')}
          style={style}
        />
      )
    }
    function skillCollideCallback(collideType: CollideType, collideTarget: ActiveContent) {
      if (collideType === CollideType.XYAxleCollide) {
        switch (collideTarget.type) {
          case ActiveTypes.Zombie:
            removeSkillTag()
            setSkills(state => [...state])
            return
        }
      }
    }
  }

  function plantCollideCallback(collideType: CollideType, collideTarget: ActiveContent) {
    if (collideType === CollideType.AttackRange && !plantAttackBase.isAttack) {
      console.log('不是吧？要打架了？')
      plantAttackBase.isAttack = true
      setIsAttack(true)
    } else if (collideType === CollideType.NotAttackRange && plantAttackBase.isAttack) {
      plantAttackBase.isAttack = false
      if (collideTarget && collideTarget.type === ActiveTypes.Zombie) {
      }
      console.log('有消息了，当前没碰撞噢')
      setIsAttack(false)
    }
  }
}

export default Peas1
