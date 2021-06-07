import Peas1 from '../../components/Battlefield/Components/Plants/Peas1'
import Potatoes from '../../components/Battlefield/Components/Plants/Potatoes'
import Sunflower from '../../components/Battlefield/Components/Plants/Sunflower'
import { Battlefield } from '../../typings/battlefield'
import { Plant } from '../../typings/plant'
import { Attack } from '../../typings/plant/attack'
export interface PlantConfig<T extends Plant.Type = Plant.Type> {
  name: string
  image: string
  sunNumber: number
  buyIntervalTime: number
  Component: Battlefield.GridProps['plant']['Component']
  content: Plant.Property<T>
}
const allPlantConfig: PlantConfig[] = [
  {
    name: '豌豆射手1',
    image: require('@/assets/images/plant_vs_zombies/pic_peas_1.png'),
    sunNumber: 100,
    buyIntervalTime: 10,
    Component: Peas1,
    content: {
      type: Plant.Type.Attack,
      content: {
        type: Attack.Type.Far,
        defenseValue: 100,
        attackSpeed: 1.5,
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
    Component: Sunflower,
    content: {
      type: Plant.Type.Reproduction,
      content: {
        interval: 3,
        quantity: 50,
        defenseValue: 50,
      },
    },
  },
  {
    name: '防御土豆',
    image: require('@/assets/images/plant_vs_zombies/pic_potatoes_1.gif'),
    sunNumber: 100,
    buyIntervalTime: 5,
    Component: Potatoes,
    content: {
      type: Plant.Type.Defensive,
      content: {
        defenseValue: 1000,
      },
    },
  },
]

export default allPlantConfig
