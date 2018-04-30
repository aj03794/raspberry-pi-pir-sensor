import { startRedis } from './redis'
import { monitorMotionSensor } from './motion-sensor'

const raspi = require('raspi-io')

const { sendMsg } = startRedis()
monitorMotionSensor({ raspi, sendMsg })
