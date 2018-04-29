import { createClient } from 'redis'
import { platform } from 'os'

console.log('platform', platform())
let attempt = 0

export const startRedis = () => {
	console.log('Initiating redis connection')
	const channel = 'motion sensor'
	const client = createClient({
		retry_strategy: function (options) {
			// console.log('retryStrategy')
			console.log('options', options)
			if (options.error && options.error.code === 'ECONNREFUSED') {
			    // End reconnecting on a specific error and flush all commands with
			    // a individual error
			    // return new Error('The server refused the connection');
				if (options.attempt >= 20) {
				    // End reconnecting with built in error
				    return undefined;
				}
				return Math.min(options.attempt * 100, 5000);
			}
			// reconnect after
				return Math.min(options.attempt * 100, 5000);
			},
		port: 6379
	})

	client.on('connect', () => {
		console.log('Connection to redis: success')
	})

	client.on('error', error => {
		console.log('ERROR OCCURRED', error)
		// console.log('client', client)
		// let attempts = 0
		// const options = {
		// 	error,
		// 	total_retry_time: 0,
		// 	attempt: attempt++
		// }
		// console.log('options before', options)
		// client.options.retryStrategy(options)
		// console.log(retryStrategy)
		// setInterval(() => {
		// 	console.log('Connection to redis: failure', err)
		// }, 5000)
		// process.exit(1);
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
