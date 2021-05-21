import { Battlefield } from "./battlefield";

export namespace Zombies {
    enum Type {
      /* 攻击 （豌豆射手等） */
      Attack = 'Attack',
      /* 防御 （土豆等） */
      Defensive = 'Defensive',
      /* 生殖 （阳光等） */
      Reproduction = 'Reproduction',
    }
    type Content = {
      /* 植物的基本数据 （防御力等） */
      [key in keyof typeof Type]: {
        defenseVal: number
      }
    } & {
      [Type.Attack]: {
        hurtValue: number
      }
      [Type.Reproduction]: {
        interval: number
        quantity: number
      }
      [Type.Defensive]: {}
    }
    export interface ComponentPropsBase {
      positionStyle: Battlefield.positionStyle
      battlefieldRef: React.MutableRefObject<HTMLDivElement>
    }
    export interface Property<T extends Type> {
      type: T
      content: Content[T]
    }
  }
  