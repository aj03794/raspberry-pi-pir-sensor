import raspi from 'raspi-io'
import five from 'johnny-five'

export const monitorMotionSensor = ({ sendMsg }) => {
	const board = new five.Board({
		io: new raspi()
	})

	board.on('ready', () => {
		console.log('Board is ready')
		const motion = new five.Motion('P1-7')
		motion.on('motionstart', () => {
			console.log('Motion detected')
			sendMsg({ motion: true })
		})
	})
}
