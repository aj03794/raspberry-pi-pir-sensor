import { startRedis } from './redis'
import { monitorMotionSensor } from './motion-sensor'

const { sendMsg } = startRedis()
monitorMotionSensor({ sendMsg })
