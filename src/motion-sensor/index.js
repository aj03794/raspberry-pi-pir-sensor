// const five = require('johnny-five')
import dateTime from 'date-time'

const timestamp = () => dateTime({ local: true, showMilliseconds: true })
console.log('TIMESTAMP', timestamp())

export const monitorMotionSensor = ({
	raspi,
	five,
	publish,
	subscribe
}) => {
	return raspi
	? realMotionSensor({ raspi, five, publish, subscribe })
	: fakeMotionSensor({ publish, subscribe })
}

const realMotionSensor = ({ raspi, five, publish, subscribe }) => {
	// Had to do this try/catch block specifically for webpack
	try {
		raspi = require('raspi-io')
		five = require('johnny-five')
	}
	catch (e) {}
	const board = new five.Board({
		io: new raspi()
	})

	board.on('ready', () => {
		console.log('Board is ready')
		const motion = new five.Motion('P1-7')
		motion.on('motionstart', () => {
			console.log('Motion detected')
			publish()
			.then(({ connect }) => connect())
			.then(({ send }) => {

				send({
				channel: 'motion sensor',
				data: {
					motion: true
				}
			})

			send({
				channel: 'slack',
				data: {
					motionDetected: timestamp(),
				}
			})
		})
		})
	})
}

const fakeMotionSensor = ({ publish, subscribe }) => {
	setInterval(() => {
		console.log('Fake motion detected')
		const date = new Date()
		publish()
		.then(({ connect }) => connect())
		.then(({ send }) => {

			send({
				channel: 'motion sensor',
				data: {
					motion: true
				}
			})

			send({
				channel: 'slack',
				data: {
					slackData: {
						channel: 'motion-sensor',
						msg: {
							motionDetected: timestamp()
						}
					}
				}
			})


	})
}, 1000)
}
