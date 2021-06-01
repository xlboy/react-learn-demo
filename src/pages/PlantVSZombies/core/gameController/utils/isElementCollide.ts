interface Position {
  left: string
  top: string
}

// 植物与僵尸的宽高
const plantZombieWH = 100
export default function (sroucePosition: Position, targetPosition: Position): boolean {
  const srouceLeft = parseInt(sroucePosition.left)
  const srouceTop = parseInt(sroucePosition.top)
  const targetLeft = parseInt(targetPosition.left)
  const targetTop = parseInt(targetPosition.top)
  // 1.左侧安全距离 =大盒子距离页面左侧距离 -小盒子占位宽
  const safeLeft = targetLeft
  // 2.右侧安全距离 大盒子距离页面左侧距离 +大盒子占位宽
  const safeRight = targetLeft + plantZombieWH
  // 3.上侧安全距离 =大盒子距离页面顶部距离 -小盒子占位高
  const safeTop = targetTop
  // 4. 下侧安全距离 = 大盒子距离页面顶部距离 + 大盒子占位高
  const safeBottom = targetTop + plantZombieWH

  const isYAxisSafe = srouceTop >= targetTop && srouceTop <= targetTop + plantZombieWH
  const isXAxisSafe = srouceLeft >= targetLeft && srouceLeft <= targetLeft + plantZombieWH
  return isYAxisSafe && isXAxisSafe
}
