/**
 * @description 战场内，碰撞检测
 */

import { Plant } from '../../typings/plant'
import { Attack } from '../../typings/plant/attack'
import { ActiveContent, ActiveType, CollideType, ZombieSlot } from '../../typings/gameController'
import allZombieConfig from '../configs/allZombieConfig'
import { Zombie } from '../../typings/zombie'
import { Battlefield } from '../../typings/battlefield'
import isElementCollide from './utils/isElementCollide'
import * as _ from 'lodash'
class GameController {
  /* 装载记录当前活跃的内容(植物、打出的技能、僵尸) */
  private activeContents: Record<symbol, ActiveContent> = {}
  private activeTags: Record<ActiveType, symbol[]> = {
    [ActiveType.Plant]: [],
    [ActiveType.Skill]: [],
    [ActiveType.Zombie]: [],
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
    ;(window as any).test = () => console.log(this)
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
          throw new Error('notUseSlot undefined')
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
    Reflect.ownKeys(this.activeContents).forEach(tag => {
      const activeContent: ActiveContent = this.activeContents[tag]
      if (activeContent.type === ActiveType.Zombie) {
        delete this.activeContents[tag]
      }
    })
    this.updateActiveTags()
  }

  addZombieSlot(slot: ZombieSlot): void {
    this.zombieSlots.push(slot)
  }

  addActiveContent(activeContent: ActiveContent, activeType: ActiveType): symbol {
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
    if (this.activeContents[tag]) {
      Object.assign(this.activeContents[tag], { ...position })
    }
  }

  private detectContentCollide(): void {
    const plantActives = this.activeTags[ActiveType.Plant]
    const skillActives = this.activeTags[ActiveType.Skill]
    const zombieActives = this.activeTags[ActiveType.Zombie]
    plantLoop: for (let i = 0; i < plantActives.length; i++) {
      const plantTag = plantActives[i]
      const plantContent: ActiveContent = this.activeContents[plantTag]
      if (zombieActives.length === 0) {
        plantContent.collideCallback(CollideType.NotAttackRange)
      } else {
        for (let i2 = 0; i2 < zombieActives.length; i2++) {
          const zombieTag = zombieActives[i2]
          const zombieContent: ActiveContent = this.activeContents[zombieTag]
          plantZombieCollide(plantContent, zombieContent)
          // 若是在攻击范围内，则退出循环
          const isQuit = plantAttackRangeDetect(plantContent, zombieContent)
          if (isQuit) continue plantLoop
        }
        plantContent.collideCallback(CollideType.NotAttackRange)
      }
    }
    zombieLoop: for (let i = 0; i < zombieActives.length; i++) {
      const zombieTag = zombieActives[i]
      const zombieContent: ActiveContent = this.activeContents[zombieTag]
      for (let i2 = plantActives.length; i2 > 0; i2--) {
        const plantTag = plantActives[i2 - 1]
        const plantContent: ActiveContent = this.activeContents[plantTag]
        // 遇到了植物，则通知开转。并跳出此次大循环（僵尸级）
        const isQuit = zombiePlantCollide(zombieContent, plantContent)
        if (isQuit) continue zombieLoop
      }
      zombieContent.collideCallback(CollideType.NotXYAxleCollide)
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
      if (plantContent.type === ActiveType.Plant && zombieContent.type === ActiveType.Zombie) {
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
                const x = attackDistance.x
                // 是否在 指定的 数值范围中（单位是px）
                if (typeof x === 'number') {
                  const srouceLeft: number = parseInt(plantContent.left)
                  const targetLeft: number = parseInt(zombieContent.left)
                  return targetLeft - srouceLeft >= (x as unknown as number)
                }
                // 植物的水平范围判断 (埋点，此处未来改。应该作大小判断)
                return (
                  isEqualLine &&
                  (x === Attack.DistanceXAxisType.Front ||
                    x === Attack.DistanceXAxisType.FrontRear ||
                    x === Attack.DistanceXAxisType.Rear)
                )
              }

              function getIsYAxisAttck(): boolean {
                const y = attackDistance.y
                // 是否在 指定的 数值范围中（单位是px）
                if (typeof y === 'number') {
                  const srouceTop: number = parseInt(plantContent.left)
                  const targetTop: number = parseInt(zombieContent.left)
                  // Y轴，上下之间的差值
                  const topDifference = Math.abs(targetTop - srouceTop)
                  return topDifference < (y as unknown as number)
                }
                return isEqualLine && y === Attack.DistanceYAxisType.CurrentLine
              }
            })()

            if (isXYAxisAttackRange) {
              plantContent.collideCallback(CollideType.AttackRange, zombieContent, plantContent)
              zombieContent.collideCallback(CollideType.AttackRange, plantContent, zombieContent)
              return true
            } else {
              // 此处会有BUG，留至入口处调
              // plantContent.collideCallback(CollideType.NotAttackRange)
            }
          }
        } else if (srouceContent.type === Plant.Type.Reproduction) {
          plantContent.collideCallback(CollideType.AttackRange, zombieContent, plantContent)
          zombieContent.collideCallback(CollideType.AttackRange, plantContent, zombieContent)
        } else if (srouceContent.type === Plant.Type.Defensive) {
        }
      }
    }
    /**植物与僵尸碰巧 */
    function plantZombieCollide(plantContent: ActiveContent, zombieContent: ActiveContent): void {
      const isCollide = isElementCollide(
        _.pick(plantContent, ['left', 'top']),
        _.pick(zombieContent, ['left', 'top'])
      )
      if (isCollide) {
        plantContent.collideCallback(CollideType.XYAxleCollide, zombieContent, plantContent)
      } else {
        plantContent.collideCallback(CollideType.NotXYAxleCollide)
      }
    }
    /**僵尸与植物碰巧 */
    function zombiePlantCollide(
      zombieContent: ActiveContent,
      plantContent: ActiveContent
    ): true | undefined {
      const isCollide = isElementCollide(
        _.pick(zombieContent, ['left', 'top']),
        _.pick(plantContent, ['left', 'top'])
      )
      if (isCollide) {
        zombieContent.collideCallback(CollideType.XYAxleCollide, plantContent, zombieContent)
        return true
      }
    }

    /**植物与打出的技能碰巧，例如（豌豆射手射出的豆与火树相撞后，豆变成了火红色，伤害力加高） */
    function plantSkillCollide(plantContent: ActiveContent, skillContent: ActiveContent): void {
      if (plantContent.type === ActiveType.Plant && skillContent.type === ActiveType.Skill) {
      }
    }
    function skillZombieCollide(skillContent: ActiveContent, zombieContent: ActiveContent): void {
      const isCollide = isElementCollide(
        _.pick(skillContent, ['left', 'top']),
        _.pick(zombieContent, ['left', 'top'])
      )
      if (isCollide) {
        skillContent.collideCallback(CollideType.XYAxleCollide, zombieContent, skillContent)
        zombieContent.collideCallback(CollideType.XYAxleCollide, skillContent, zombieContent)
      }
    }
  }

  private updateActiveTags(): void {
    this.activeTags[ActiveType.Plant] = []
    this.activeTags[ActiveType.Skill] = []
    this.activeTags[ActiveType.Zombie] = []

    Reflect.ownKeys(this.activeContents).forEach(tag => {
      const activeContent: ActiveContent = this.activeContents[tag]
      this.activeTags[activeContent.type].push(tag as symbol)
    })
    // 过滤一下植物的顺序，碰撞检测那用到
    this.activeTags[ActiveType.Plant].sort((aTag, bTag) => {
      const aContent: ActiveContent = this.activeContents[aTag]
      const bContent: ActiveContent = this.activeContents[bTag]
      return parseInt(aContent.left) - parseInt(bContent.left)
    })
    // this.activeTags[ActiveType.Plant].forEach(tag => {
    //   console.log(this.activeContents[tag])
    // })
  }
}

const gameController = new GameController()

export default gameController
