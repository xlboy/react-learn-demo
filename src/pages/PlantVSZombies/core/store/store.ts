import { makeAutoObservable } from 'mobx'
import allPlantConfig, { PlantConfig } from '../configs/allPlantConfig'
import _ from 'loadsh'

export class Store {
  sunNumber: number = 50
  plantCardList: PlantConfig[] = _.cloneDeep(allPlantConfig)

  currentSelectPlant: null | PlantConfig = null
  constructor() {
    makeAutoObservable(this)
  }

  setSunNumber = (value: number) => {
    this.sunNumber = value
  }

  setCurrentSelectPlant = (plantConfig: null | PlantConfig) => {
    this.currentSelectPlant = plantConfig
  }
}

export default new Store()
