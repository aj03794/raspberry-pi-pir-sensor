import { createClient } from 'redis'

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
