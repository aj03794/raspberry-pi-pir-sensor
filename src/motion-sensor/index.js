// const five = require('johnny-five')

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
	raspi = require('raspi-io')
	five = require('johnny-five')
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
					motionDetected: `${date.getMonth()}-${date.getDate()}-${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}::${date.getSeconds()}`,
					text: 'Motion detected at'
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
					motionDetected: `${date.getMonth()}-${date.getDate()}-${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}::${date.getSeconds()}`,
					text: 'Motion detected at'
				}
			})


	})
}, 1000)
}
