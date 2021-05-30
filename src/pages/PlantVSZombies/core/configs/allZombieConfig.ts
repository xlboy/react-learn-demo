import { Attack } from '../../typings/plant/attack'

export interface ZombieConfig {
  name: string
  imagePath: string
  content: ZombiesContent
}
export interface ZombiesContent {
  hurtValue: number
  defenseValue: number
  movementSpe: number
}
const allZombieConfig: ZombieConfig[] = [
  {
    name: '普通僵尸1',
    imagePath: '@/assets/images/plant_vs_zombies/pic_zombie-1.gif',
    content: {
      hurtValue: 20,
      defenseValue: 100,
      movementSpe: 1,
    },
  },
]

export default allZombieConfig
