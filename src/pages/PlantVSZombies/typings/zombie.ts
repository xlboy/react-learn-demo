import { Battlefield } from './battlefield'

export namespace Zombie {
  enum Type {
    Ordinary = 'Ordinary',
  }
  export namespace Content {
    export interface Base {
      defenseValue: number
    }
    export type Default =
      | {
          type: Type.Ordinary
          content: {
            
          }
        }
  }
  export type Property = Content.Default
}
