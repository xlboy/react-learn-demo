/**
 * @description 战场内，碰撞检测
 */

import { Plant } from '../../typings/plant'
import { Attack } from '../../typings/plant/attack'
import { PlantConfig } from '../configs/allPlantConfig'
import { ZombiesConfig } from '../configs/allZombiesConfig'

export enum CollideType {
  AttackRange,
  XYAxleCollide,
}
export interface ActiveContent {
  left: string
  top: string
  type: 'plant' | 'zombies' | 'skill'
  content?: PlantConfig | ZombiesConfig
  collideCallback(collideType: CollideType, collideTarget: ActiveContent)
}
class BattlefieldCollideDetect {
  /* 装载记录当前活跃的内容(植物、打出的技能、僵尸) */
  private activeContents: Record<symbol, ActiveContent> = {}
  constructor() {}

  detectContentCollide() {
    const activeContentSrouce = Reflect.ownKeys(this.activeContents)
    activeContentSrouce.forEach(tagSrouce => {
      activeContentSrouce.forEach(tagTarget => {
        if (tagSrouce !== tagTarget) {
          const collideSrouce: ActiveContent = this.activeContents[tagSrouce]
          const collideTarget: ActiveContent = this.activeContents[tagTarget]

          if (collideSrouce.type === 'plant' && collideTarget.type === 'zombies') {
            const { content } = collideSrouce.content as PlantConfig

            if (content.type === Plant.Type.Attack) {
              const { attackDistance } = content.content as any
              if (
                attackDistance.x === Attack.DistanceXAxisType.Front &&
                attackDistance.y === Attack.DistanceYAxisType.CurrentLine
              ) {
                const isEqualLine = collideSrouce.top === collideTarget.top
                if (isEqualLine && collideTarget.left > collideSrouce.left) {
                  collideSrouce.collideCallback(CollideType.AttackRange, collideTarget)
                }
              }
            }
          }
        }
      })
    })
  }

  addActiveContent(activeContent: ActiveContent): symbol {
    const tag = Symbol()
    this.activeContents[tag] = activeContent
    return tag
  }

  removeActiveContent(tag: symbol): void {
    delete this.activeContents[tag]
  }
}

const battlefieldCollideDetect = new BattlefieldCollideDetect()

;(function detectContentCollide() {
  battlefieldCollideDetect.detectContentCollide()
  requestAnimationFrame(detectContentCollide)
})()

export default battlefieldCollideDetect
