import { startRedis } from './redis'
import { monitorMotionSensor } from './motion-sensor'
import { platform } from 'os'

console.log('platform', platform())

const raspi = require('../package.json').dependencies['raspi-io']
const five = require('../package.json').dependencies['johnny-five']

// console.log('aasdfadf', require('../package.json'))

// console.log('raspi', raspi ? true : false)

const { sendMsg } = startRedis()
monitorMotionSensor({
	raspi,
	five,
	sendMsg
})
