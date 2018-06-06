import { monitorMotionSensor } from './motion-sensor'
import { platform } from 'os'
import { publisher as publisherCreator, subscriber as subscriberCreator } from './redis'
import { slack as slackCreator } from './slack'

console.log('platform', platform())

// const { publish } = redis()

const raspi = require('../package.json').dependencies['raspi-io']
const five = require('../package.json').dependencies['johnny-five']
Promise.all([
	publisherCreator(),
	subscriberCreator()
])
.then(([
	{ publish },
	{ subscribe }
]) => {
	const slack = slackCreator({ publish })
	monitorMotionSensor({
		raspi,
		five,
		publish,
		subscribe,
		slack
	})
})

