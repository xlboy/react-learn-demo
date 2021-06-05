import OrdinaryZombie from '../../components/Battlefield/Components/Zombie/OrdinaryZombie'
import { Zombie } from '../../typings/zombie'

export interface ZombieConfig {
  name: string
  image: string
  content: Zombie.Property
  zoomIndex?: number
  testName?: string
  Component: (props: Zombie.PropsBase) => JSX.Element
}
const allZombieConfig: ZombieConfig[] = [
  {
    name: '普通僵尸',
    image: require('@/assets/images/plant_vs_zombies/pic_zombie-1.gif'),
    content: {
      type: Zombie.Type.Ordinary,
      content: {
        hurtValue: 20,
        defenseValue: 100,
        moveSpeed: 1,
      },
    },
    Component: OrdinaryZombie,
  },
  {
    name: '戴了个萝卜头の僵尸',
    image: require('@/assets/images/plant_vs_zombies/pic_zombie-2.gif'),
    content: {
      type: Zombie.Type.Ordinary,
      content: {
        hurtValue: 30,
        defenseValue: 140,
        moveSpeed: 0.9,
      },
    },
    Component: OrdinaryZombie,
  },
  {
    name: '戴了个铁桶の僵尸',
    image: require('@/assets/images/plant_vs_zombies/pic_zombie-3.gif'),
    content: {
      type: Zombie.Type.Ordinary,
      content: {
        hurtValue: 30,
        defenseValue: 160,
        moveSpeed: 0.9,
      },
    },
    Component: OrdinaryZombie,
  },
  {
    name: '老头子僵尸',
    image: require('@/assets/images/plant_vs_zombies/pic_zombie-5.gif'),
    zoomIndex: 1.5,
    content: {
      type: Zombie.Type.Ordinary,
      content: {
        hurtValue: 50,
        defenseValue: 200,
        moveSpeed: 0.3,
      },
    },
    Component: OrdinaryZombie,
  },
]

export default allZombieConfig
