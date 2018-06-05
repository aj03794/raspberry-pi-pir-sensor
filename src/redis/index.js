import { createClient, ReplyError } from 'redis'
import { createSubject } from 'create-subject-with-filter'
import { readlinkSync } from 'fs';

const clients = {} // inject this to manage scope

const getClient = ({ type }) => ({
	connect: () => new Promise(resolve => {
		// console.log('------>', clients)
		if (!clients[type]) {
			console.log('Creating new client')
			setClient({
				type,
				client: createClient({
					retry_strategy: function (options) {
						console.log('options', options)
						if (options.error && options.error.code === 'ECONNREFUSED') {
						// End reconnecting on a specific error and flush all commands with
						// a individual error
							if (options.attempt >= 20) {
							    // End reconnecting with built in error
							    return undefined;
							}
							return Math.min(options.attempt * 100, 5000);
						}
						// reconnect after
						return Math.min(options.attempt * 100, 5000);
					},
					host: process.env.IP_ADDRESS,
					port: 6379,
					command_queue_length: 2,
					reply: 'OFF'
				})
			})
		}
		return resolve(clients[type])
	})
})

const setClient = ({ type, client }) => clients[type] = client

export const redis = () => ({
	publish: () => new Promise((resolve, reject) => {
		const c = getClient({ type: '__publisher' })
		return resolve({
			connect: () => c.connect().then(client => ({
				send: ({
					channel,
					data
				}) => new Promise(resolve => {
					console.log('=====>', client.command_queue_length)
					// console.log('ReplyError', ReplyError)
					// client.on('error', (...args) => {
					// 	console.log('----->', args)
					// 	console.log('publish - error', args)
					// })
					// client.publish()
					console.log('-----------------')
					// console.log(client)
					data = JSON.stringify(data)
					client.publish(channel, data)

					return resolve({
						meta: {
							type: 'published',
							timestamp: new Date().getTime()
						}
					})
				})
			}))
		})
	}),
	// subscribe: ({ channel }) => new Promise(resolve => {
	// 	const c = getClient({ type: channel })
	// 	return resolve({
	// 		connect: () => c.connect()
	// 			.then(client => {

	// 				const {
	// 					subscribe: allMsgs,
	// 					filter: filterMsgs,
	// 					next
	// 				} = createSubject()
	// 				client.subscribe(channel)
	// 				client.on('error', (...args) => {
	// 					console.log('subscribe - error', args)
	// 				})
	// 				client.on('connect', (...args) => {
	// 					console.log('Connected to Redis')
	// 					// ...args looks like [ 'motion sensor', '{"msg":{"motion":false}}' ]
	// 					client.on('message', (...args) => {
	// 						next({
	// 							meta: {
	// 								type: 'message',
	// 								timestamp: new Date().getTime()
	// 							},
	// 							data: args
	// 						})
	// 					})
	// 					client.on('error', (...args) => {
	// 						console.log('ERROR OCCURRED', error)
	// 						next({
	// 							meta: {
	// 								type: 'error',
	// 								timestamp: new Date().getTime(),
	// 								data: args 
	// 							}
	// 						})
	// 					})
	// 					next({
	// 						meta: {
	// 							type: 'connect',
	// 							timestamp: new Date().getTime(),
	// 							data: args
	// 						}
	// 					})
	// 				})
	// 				return {
	// 					allMsgs,
	// 					filterMsgs
	// 				}
	// 			})
	// 	})
	// })
})
