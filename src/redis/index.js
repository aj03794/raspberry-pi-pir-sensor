import { createClient } from 'redis'
import { platform } from 'os'

console.log('platform', platform())

export const startRedis = () => {
	console.log('Initiating redis connection')
	const channel = 'motion sensor'
	const client = createClient(6379)

	client.on('connect', () => {
		console.log('Connection to redis: success')
	})

	client.on('error', err => {
		console.log('Connection to redis: failure', err)
		process.exit(1);
	})




	const sendMsg = (msg) => {
		client.publish(channel, JSON.stringify({
			msg
		}))
	}

	return {
		sendMsg
	}
}
