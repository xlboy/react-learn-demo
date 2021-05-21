import { Plant } from '.'

export namespace Attack {
  export enum Type {
    Far = 'Far',
    Near = 'Near',
    Explosion = 'Explosion',
  }
  export enum DistanceXAxisType {
    /* 植物前面 */
    Front = 'Front',
    /* 植物后面 */
    Rear = 'Rear',
    /* 植物前后 */
    FrontRear = 'Rear',
  }
  export enum DistanceYAxisType {
    /* 当前行 */
    CurrentLine = 'CurrentLine',
  }
  export enum DamageDistanceType {
    /* 立即销毁 (碰到即销毁) */
    InstantDestruction = 'InstantDestruction',
    /* 穿透 (碰到后还继续传递,穿透伤害过去) */
    Through = 'Through'
  }
  export interface Content extends Plant.Content.Base {
    type: Type
    hurtValue: number
    /* 攻击距离 */
    attackDistance?: {
      x: DistanceXAxisType | number
      y: DistanceYAxisType | number
    }
    /* 伤害距离 */
    damageDistance?: {
      x: DamageDistanceType | number
      y: DamageDistanceType | number
    }
  }
}
