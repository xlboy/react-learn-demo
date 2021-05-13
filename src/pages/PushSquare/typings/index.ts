export namespace Matrix {
  export interface Source {
    id: number
    showContent: any
    isMovePoint: boolean
  }
  export interface State {
    size: {
      width: number
      height: number
    }
    source: Source[][]
    isStart: boolean
  }
}
