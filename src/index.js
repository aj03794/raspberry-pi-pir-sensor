import { startRedis } from './redis'
import { monitorMotionSensor } from './motion-sensor'
import { platform } from 'os'

console.log('platform', platform())

const raspi = require('../package.json')['raspi-io']
const five = require('../package.json')['johnny-five']

const { sendMsg } = startRedis()
monitorMotionSensor({
	raspi,
	five,
	sendMsg
})
