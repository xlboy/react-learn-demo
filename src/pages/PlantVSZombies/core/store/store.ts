import { makeAutoObservable } from 'mobx'
import allPlantConfig, { PlantConfig } from '../configs/allPlantConfig'
import _ from 'loadsh'

export class Store {
  sunNumber: number = 50
  plantCardList: PlantConfig[] = _.cloneDeep(allPlantConfig)
  constructor() {
    makeAutoObservable(this)
  }

  setSunNumber = (value: number) => {
    this.sunNumber = value
  }
}

export default new Store()
