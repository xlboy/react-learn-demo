import { Battlefield } from '../battlefield'
import { Attack } from './attack'
import { Defensive } from './defensive'
import { Reproduction } from './reproduction'

type LookUp<O extends object, K extends string> = O extends { type: K } ? O : never

export namespace Plant {
  export enum Type {
    /* 攻击类型  */
    Attack = 'Attack',
    /* 防御类型  */
    Defensive = 'Defensive',
    /* 生殖类型  */
    Reproduction = 'Reproduction',
  }

  export namespace Content {
    export interface Base {
      defenseValue: number
    }
    export type Default =
      | {
          type: Type.Attack
          content: Attack.Content
        }
      | {
          type: Type.Defensive
          content: Defensive.Content
        }
      | {
          type: Type.Reproduction
          content: Reproduction.Content
        }
  }
  export type Property<T extends Type = Type> = LookUp<Content.Default, T>

}
