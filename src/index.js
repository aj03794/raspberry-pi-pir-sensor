import { monitorMotionSensor } from './motion-sensor'
import { platform } from 'os'
import { redis } from 'pub-sub-redis'
import { slack as slackCreator } from './slack'

const raspi = require('../package.json').dependencies['raspi-io']
const five = require('../package.json').dependencies['johnny-five']

const { publisherCreator, subscriberCreator } = redis()

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

