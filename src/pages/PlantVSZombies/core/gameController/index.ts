/**
 * @description 战场内，碰撞检测
 */

import { Plant } from '../../typings/plant'
import { Attack } from '../../typings/plant/attack'
import { ActiveContent, ActiveTypes, CollideType } from '../../typings/gameController'

class GameController {
  /* 装载记录当前活跃的内容(植物、打出的技能、僵尸) */
  private activeContents: Record<symbol, ActiveContent> = {}
  private activeTags: Record<ActiveTypes, symbol[]> = {
    [ActiveTypes.Plant]: [],
    [ActiveTypes.Skill]: [],
    [ActiveTypes.Zombie]: [],
  }
  constructor() {}

  detectContentCollide(): void {
    const plantActives = this.activeTags[ActiveTypes.Plant]
    const skillActives = this.activeTags[ActiveTypes.Skill]
    const zombieActives = this.activeTags[ActiveTypes.Zombie]
    plantActives.forEach(plantTag => {
      const plantContent: ActiveContent = this.activeContents[plantTag]
      zombieActives.forEach(zombieTag => {
        const zombieContent: ActiveContent = this.activeContents[zombieTag]
        plantAttackRangeDetect(plantContent, zombieContent)
      })

      skillActives.forEach(skillTag => {
        const skillContent: ActiveContent = this.activeContents[skillTag]
        plantSkillCollide(plantContent, skillContent)
      })
    })

    /**检测僵尸是否达到了植物的攻击范围 */
    function plantAttackRangeDetect(
      plantContent: ActiveContent,
      zombieContent: ActiveContent
    ): void {
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
            }
          }
        } else if (srouceContent.type === Plant.Type.Reproduction) {
          plantContent.collideCallback(CollideType.AttackRange, zombieContent)
          zombieContent.collideCallback(CollideType.AttackRange, plantContent)
        } else if (srouceContent.type === Plant.Type.Defensive) {
        } else {
          plantContent.collideCallback(CollideType.NotAttackRange)
        }
      }
    }

    /**植物与打出的技能碰巧，例如（豌豆射手射出的豆与火树相撞后，豆变成了火红色，伤害力加高） */
    function plantSkillCollide(plantContent: ActiveContent, skillContent: ActiveContent): void {
      if (plantContent.type === ActiveTypes.Plant && skillContent.type === ActiveTypes.Skill) {
      }
    }
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

;(function detectContentCollide() {
  gameController.detectContentCollide()
  requestAnimationFrame(detectContentCollide)
})()

export default gameController
