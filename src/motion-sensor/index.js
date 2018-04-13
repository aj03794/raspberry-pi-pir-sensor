let motion = false

export const monitorMotionSensor = ({ sendMsg }) => {
	setInterval(() => {
		motion = !motion
		if(motion) {
			console.log('Motion true', motion)
			return sendMsg({ motion: true })
		} else {
			console.log('Motion false', motion)
			return sendMsg({ motion: false })
		}
	}, 5000)
}
