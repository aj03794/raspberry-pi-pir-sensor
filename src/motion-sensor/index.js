const five = require('johnny-five')

export const monitorMotionSensor = ({ raspi, sendMsg }) => {
	return raspi
	? realMotionSensor({ raspi, sendMsg })
	: fakeMotionSensor({ sendMsg })
}

const realMotionSensor = ({ raspi, sendMsg }) => {
	const board = new five.Board({
		io: new raspi()
	})

	board.on('ready', () => {
		console.log('Board is ready')
		const motion = new five.Motion('P1-7')
		motion.on('motionstart', () => {
			console.log('Motion detected')
			sendMsg({
				motion: true
			})
		})
	})
}

const fakeMotionSensor = ({ sendMsg }) => {
	setInterval(() => {
		console.log('Fake motion detected')
		sendMsg({
			motion: true
		})
	}, 5000)
}
