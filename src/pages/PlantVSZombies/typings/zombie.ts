import { ZombieConfig } from '../core/configs/allZombieConfig'
import { Battlefield } from './battlefield'

export namespace Zombie {
  export enum Type {
    Ordinary = 'Ordinary',
  }
  export namespace Content {
    export interface Base {
      defenseValue: number
      /**移动速度，1以下，越小越快 */
      moveSpeed: number
      hurtValue: number
    }
    interface Ordinary extends Base {}
    export type Default = {
      type: Type.Ordinary
      content: Ordinary
    }
  }
  export interface PropsBase {
    positionStyle: Battlefield.positionStyle
    battlefieldRef: React.MutableRefObject<HTMLDivElement>
    zombieConfig: ZombieConfig
    removeZombie(): void
  }

  export type Property = Content.Default
}
