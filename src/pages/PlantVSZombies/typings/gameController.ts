import { PlantConfig } from '../core/configs/allPlantConfig'
import { ZombieConfig } from '../core/configs/allZombieConfig'
import { Zombie } from './zombie'

export enum CollideType {
  /**攻击范围 */
  AttackRange = 'AttackRange',
  /**无攻击范围 */
  NotAttackRange = 'NotAttackRange',
  /**ＸＹ轴碰撞 */
  XYAxleCollide = 'XYAxleCollide',
  /**无ＸＹ轴碰撞 */
  NotXYAxleCollide = 'NotXYAxleCollide',
}

export enum ActiveType {
  Plant = 'Plant',
  Zombie = 'Zombie',
  Skill = 'Skill',
}
export type ActiveTarget =
  | {
      type: ActiveType.Plant
      content: PlantConfig
      swapCallback(swapType: SwapType, swapTarget: ActiveContent): void
    }
  | {
      type: ActiveType.Zombie
      content: ZombieConfig
      swapCallback(swapType: SwapType, swapTarget: ActiveContent): void
    }
  | {
      type: ActiveType.Skill
      content: {
        hurtValue: number
        tag?: symbol
      }
    }
export enum SwapType {
  /**触发攻击，爆锤对方 */
  NowAttack = 'NowAttack',
}
export type ActiveContent = {
  left: string
  top: string
  /**碰撞类型、碰撞的目标（敌方）、碰撞源（自身） */
  collideCallback(
    collideType: CollideType,
    collideTarget?: ActiveContent,
    collideSource?: ActiveContent
  ): void
} & ActiveTarget

export interface ZombieSlot {
  id: symbol
  hasZombie: boolean
  addZombie(zombieConfig: ZombieConfig, startPosition: Zombie.PropsBase['positionStyle']): void
  removeZombie(): void
}
