import { makeAutoObservable, autorun } from 'mobx'
import allPlantConfig, { PlantConfig } from '../configs/allPlantConfig'
import _ from 'loadsh'

export class Store {
  sunNumber: number = 50
  plantCardList: PlantConfig[] = _.cloneDeep(allPlantConfig)
  isStart: boolean = false
  currentSelectPlant: null | PlantConfig = null
  constructor() {
    makeAutoObservable(this)
  }
  setSunNumber = (value: number): void => {
    this.sunNumber = value
  }

  setCurrentSelectPlant = (plantConfig: null | PlantConfig): void => {
    this.currentSelectPlant = plantConfig
  }

  setIsStart = (value: boolean): void => {
    this.isStart = value
  }
}

export default new Store()
