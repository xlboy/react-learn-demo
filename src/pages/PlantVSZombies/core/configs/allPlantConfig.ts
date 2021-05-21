import Peas1 from '../../components/Battlefield/Components/Peas1'
import { Battlefield } from '../../typings/battlefield'
import { Plant } from '../../typings/plant'
import { Attack } from '../../typings/plant/attack'

export interface PlantConfig {
  name: string
  image: string
  sunNumber: number
  buyIntervalTime: number
  Component: Battlefield.GridProps['plant']['Component']
  content: Plant.Property
}
const allPlantConfig: PlantConfig[] = [
  {
    name: '豌豆射手',
    image: require('@/assets/images/plant_vs_zombies/pic_peas_1.png'),
    sunNumber: 100,
    buyIntervalTime: 10,
    Component: Peas1,
    content: {
      type: Plant.Type.Attack,
      content: {
        defenseValue: 100,
        type: Attack.Type.Far,
        hurtValue: 20,
        attackDistance: {
          x: Attack.DistanceXAxisType.Front,
          y: Attack.DistanceYAxisType.CurrentLine,
        },
      },
    },
  },
  {
    name: '向日葵',
    image: require('@/assets/images/plant_vs_zombies/pic_sunflower.png'),
    sunNumber: 50,
    buyIntervalTime: 5,
    Component: Peas1,
    content: {
      type: Plant.Type.Reproduction,
      content: {
        interval: 3,
        quantity: 50,
        defenseValue: 50,
      },
    },
  },
]

export default allPlantConfig
