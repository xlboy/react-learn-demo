export namespace Tictactoe {
  export interface MartixGrid {
    /* 格子处对应的玩家，null -> 未有玩家, true -> 0, false -> X */
    player: null | boolean
  }
  export interface State {
    /* 当前玩家，true -> 0, false -> X */
    currentPlayer: boolean
    /* 胜利玩家，null -> 尚未分出胜负，1 -> 打平局，true -> 0, false -> X */
    victoryPlayer: null | 1 | boolean
    martixGridSize: number
    martixSource: MartixGrid[][]
  }
}
