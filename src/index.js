import { monitorMotionSensor } from './motion-sensor'
import { platform } from 'os'
import { redis } from './redis'

console.log('platform', platform())

const { publish, subscribe } = redis()

// console.log('publish', publish)

const raspi = require('../package.json').dependencies['raspi-io']
const five = require('../package.json').dependencies['johnny-five']

console.log('raspi', raspi)
console.log('five', five)

monitorMotionSensor({
	raspi,
	five,
	publish,
	subscribe
})
