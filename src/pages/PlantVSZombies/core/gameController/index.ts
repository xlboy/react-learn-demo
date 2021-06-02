/**
 * @description 战场内，碰撞检测
 */

import { Plant } from '../../typings/plant'
import { Attack } from '../../typings/plant/attack'
import { ActiveContent, ActiveTypes, CollideType, ZombieSlot } from '../../typings/gameController'
import useStore from '../store/useStore'
import { autorun } from 'mobx'
import allZombieConfig from '../configs/allZombieConfig'
import { Zombie } from '../../typings/zombie'
import { Battlefield } from '../../typings/battlefield'
import isElementCollide from './utils/isElementCollide'
import * as _ from 'lodash'
class GameController {
  /* 装载记录当前活跃的内容(植物、打出的技能、僵尸) */
  private activeContents: Record<symbol, ActiveContent> = {}
  private activeTags: Record<ActiveTypes, symbol[]> = {
    [ActiveTypes.Plant]: [],
    [ActiveTypes.Skill]: [],
    [ActiveTypes.Zombie]: [],
  }
  private zombieSlots: ZombieSlot[] = []
  private putZombieTimer: NodeJS.Timeout | null = null

  constructor() {
    const detectCollide = () => this.detectContentCollide()
    ;(function detectCollideLoop() {
      detectCollide()
      setTimeout(() => {
        requestAnimationFrame(detectCollideLoop)
      }, 20)
    })()
  }

  startPutZombie(): void {
    if (this.putZombieTimer === null) {
      const generateZombie = () => {
        const notUseSlot = this.zombieSlots.find(slot => slot.hasZombie === false)
        if (notUseSlot) {
          const zombie = allZombieConfig[~~(Math.random() * allZombieConfig.length)]
          const startPosition: Zombie.PropsBase['positionStyle'] = {
            left: '1040px',
            top: `${110 * ~~(Math.random() * 5)}px`,
          }
          notUseSlot.addZombie(zombie, startPosition)
        } else {
          throw new Error("notUseSlot undefined");
        }
      }
      generateZombie()
      this.putZombieTimer = setInterval(generateZombie, 1500)
    }
  }

  stopPutZomzbie(): void {
    clearInterval(this.putZombieTimer)
    this.putZombieTimer = null
    this.zombieSlots.forEach(slot => {
      slot.removeZombie()
      slot.hasZombie = false
    })
  }

  addZombieSlot(slot: ZombieSlot): void {
    this.zombieSlots.push(slot)
  }

  addActiveContent(activeContent: ActiveContent): symbol {
    const tag = Symbol()
    this.activeContents[tag] = activeContent
    this.updateActiveTags()
    return tag
  }

  removeActiveContent(tag: symbol): void {
    delete this.activeContents[tag]
    this.updateActiveTags()
  }

  updateActiveContentPosition(tag: symbol, position: Battlefield.PropsBase['positionStyle']): void {
    Object.assign(this.activeContents[tag], { ...position })
  }

  private detectContentCollide(): void {
    const plantActives = this.activeTags[ActiveTypes.Plant]
    const skillActives = this.activeTags[ActiveTypes.Skill]
    const zombieActives = this.activeTags[ActiveTypes.Zombie]
    stop: for (let i = 0; i < plantActives.length; i++) {
      const plantTag = plantActives[i]
      const plantContent: ActiveContent = this.activeContents[plantTag]
      if (zombieActives.length === 0) {
        plantContent.collideCallback(CollideType.NotAttackRange)
      } else {
        for (let i2 = 0; i2 < zombieActives.length; i2++) {
          const zombieTag = zombieActives[i2]
          const zombieContent: ActiveContent = this.activeContents[zombieTag]
          const isQuit = plantAttackRangeDetect(plantContent, zombieContent)
          if (isQuit) break stop
        }
      }
    }

    skillActives.forEach(skillTag => {
      const skillContent: ActiveContent = this.activeContents[skillTag]
      plantActives.forEach(plantTag => {
        const plantContent: ActiveContent = this.activeContents[plantTag]
        plantSkillCollide(plantContent, skillContent)
      })
      zombieActives.forEach(zombieTag => {
        const zombieContent: ActiveContent = this.activeContents[zombieTag]
        skillZombieCollide(skillContent, zombieContent)
      })
    })

    /**检测僵尸是否达到了植物的攻击范围 */
    function plantAttackRangeDetect(
      plantContent: ActiveContent,
      zombieContent: ActiveContent
    ): true | undefined {
      if (plantContent.type === ActiveTypes.Plant && zombieContent.type === ActiveTypes.Zombie) {
        const { content: srouceContent } = plantContent.content
        const isEqualLine = plantContent.top === zombieContent.top

        if (srouceContent.type === Plant.Type.Attack) {
          const { attackDistance } = srouceContent.content
          // 判断植物源的攻击范围是否为水平之间的（同一行）
          if (attackDistance.y === Attack.DistanceYAxisType.CurrentLine) {
            const isXYAxisAttackRange: boolean = (() => {
              const isXAxisAttck = getIsXAxisAttck()
              const isYAxisAttck = getIsYAxisAttck()
              return isXAxisAttck && isYAxisAttck

              function getIsXAxisAttck(): boolean {
                const x = attackDistance.x as Attack.DistanceXAxisType
                // 植物的水平范围判断
                if (
                  isEqualLine &&
                  (x === Attack.DistanceXAxisType.Front ||
                    x === Attack.DistanceXAxisType.FrontRear ||
                    x === Attack.DistanceXAxisType.Rear)
                ) {
                  return true
                }
                // 是否在 指定的 数值范围中（单位是px）
                const srouceLeft: number = parseInt(plantContent.left)
                const targetLeft: number = parseInt(zombieContent.left)
                return targetLeft - srouceLeft >= (x as unknown as number)
              }

              function getIsYAxisAttck(): boolean {
                const y = attackDistance.y as Attack.DistanceYAxisType
                if (y === Attack.DistanceYAxisType.CurrentLine) {
                  return true
                }
                // 是否在 指定的 数值范围中（单位是px）
                const srouceTop: number = parseInt(plantContent.left)
                const targetTop: number = parseInt(zombieContent.left)
                // Y轴，上下之间的差值
                const topDifference = Math.abs(targetTop - srouceTop)
                return topDifference < (y as number)
              }
            })()

            if (isXYAxisAttackRange) {
              plantContent.collideCallback(CollideType.AttackRange, zombieContent)
              zombieContent.collideCallback(CollideType.AttackRange, plantContent)
              return true
            } else {
              plantContent.collideCallback(CollideType.NotAttackRange)
            }
          }
        } else if (srouceContent.type === Plant.Type.Reproduction) {
          plantContent.collideCallback(CollideType.AttackRange, zombieContent)
          zombieContent.collideCallback(CollideType.AttackRange, plantContent)
        } else if (srouceContent.type === Plant.Type.Defensive) {
        }
      }
    }

    /**植物与打出的技能碰巧，例如（豌豆射手射出的豆与火树相撞后，豆变成了火红色，伤害力加高） */
    function plantSkillCollide(plantContent: ActiveContent, skillContent: ActiveContent): void {
      if (plantContent.type === ActiveTypes.Plant && skillContent.type === ActiveTypes.Skill) {
      }
    }

    function skillZombieCollide(skillContent: ActiveContent, zombieContent: ActiveContent): void {
      const isCollide = isElementCollide(
        _.pick(skillContent, ['left', 'top']),
        _.pick(zombieContent, ['left', 'top'])
      )
      if (isCollide) {
        skillContent.collideCallback(CollideType.XYAxleCollide, zombieContent)
        zombieContent.collideCallback(CollideType.XYAxleCollide, skillContent)
      }
    }
  }

  private updateActiveTags(): void {
    this.activeTags[ActiveTypes.Plant] = []
    this.activeTags[ActiveTypes.Skill] = []
    this.activeTags[ActiveTypes.Zombie] = []

    Reflect.ownKeys(this.activeContents).forEach(tag => {
      const activeContent: ActiveContent = this.activeContents[tag]
      this.activeTags[activeContent.type].push(tag as symbol)
    })
  }
}

const gameController = new GameController()

export default gameController
