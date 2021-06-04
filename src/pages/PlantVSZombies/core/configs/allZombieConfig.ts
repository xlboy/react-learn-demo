import OrdinaryZombie from '../../components/Battlefield/Components/Zombie/OrdinaryZombie'
import { Zombie } from '../../typings/zombie'

export interface ZombieConfig {
  name: string
  image: string
  content: Zombie.Property
  testName?: string
  Component: (props: Zombie.PropsBase) => JSX.Element
}
const allZombieConfig: ZombieConfig[] = [
  {
    name: '普通僵尸1',
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
]

export default allZombieConfig
