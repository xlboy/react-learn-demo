import { Plant } from '.'

export namespace Reproduction {
  export enum Type {}

  export interface Content extends Plant.Content.Base {
    interval: number
    quantity: number
  }
}
