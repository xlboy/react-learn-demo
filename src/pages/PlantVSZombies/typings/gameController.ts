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
}
export enum ActiveTypes {
  Plant = 'Plant',
  Zombie = 'Zombie',
  Skill = 'Skill',
}
type ActiveTarget =
  | {
      type: ActiveTypes.Plant
      content: PlantConfig
    }
  | {
      type: ActiveTypes.Zombie
      content: ZombieConfig
    }
  | {
      type: ActiveTypes.Skill
      content: {
        hurtValue: number
      }
    }
export type ActiveContent = {
  left: string
  top: string
  collideCallback(collideType: CollideType, collideTarget?: ActiveContent): void
} & ActiveTarget

export interface ZombieSlot {
  id: symbol
  hasZombie: boolean
  addZombie(zombieConfig: ZombieConfig, startPosition: Zombie.PropsBase['positionStyle']): void
  removeZombie(): void
}
