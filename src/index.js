import { monitorMotionSensor } from './motion-sensor'
import { platform } from 'os'
import { redis } from './redis'
import { slack as slackCreator } from './slack'

console.log('platform', platform())

const { publish } = redis()
const slack = slackCreator({ publish })

const subscribe = () => {}

const raspi = require('../package.json').dependencies['raspi-io']
const five = require('../package.json').dependencies['johnny-five']

monitorMotionSensor({
	raspi,
	five,
	publish,
    subscribe,
    slack
})
