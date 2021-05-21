import { Battlefield } from '../battlefield'
import { Attack } from './attack';
import { Defensive } from './defensive';
import { Reproduction } from './reproduction';
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
    export interface Default {
      [Type.Attack]: Attack.Content
      [Type.Defensive]: Defensive.Content
      [Type.Reproduction]: Reproduction.Content
    }
  }
  export interface Property<T extends Type = Type> {
    type: T
    content: Content.Default[T]
  }
}
