// const five = require('johnny-five')
import dateTime from 'date-time'

const timestamp = () => dateTime({ local: true, showMilliseconds: true })
console.log('TIMESTAMP', timestamp())

export const monitorMotionSensor = ({
	raspi,
	five,
	publish,
    subscribe,
    slack
}) => {
	return raspi
	? realMotionSensor({ raspi, five, publish, subscribe, slack })
	: fakeMotionSensor({ publish, subscribe, slack })
}

const realMotionSensor = ({ raspi, five, publish, subscribe, slack }) => {
    console.log('realMotionSensor')
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

            slack({
                slackMsg: {
                    msg: 'Real motion detected',
                    timestamp: timestamp()
                }
            })
        })
        })
    })
}

const fakeMotionSensor = ({ publish, subscribe, slack }) => {
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

            slack({
                slackMsg: {
                    msg: 'Fake motion detected',
                    timestamp: timestamp()
                }
            })


	})
}, 1000)
}
