export namespace Tower {
  export interface Block {
    size: number
  }
  export interface Srouce {
    topBlock: null | Block
    blocks: Block[]
  }
  export interface State {
    towerSrouce: Srouce[]
    isVictory: boolean
    countAction: number
  }
  export interface GridBlockProps {
    block: Block
    gridIndex: number
    blockIndex: number
  }
}
